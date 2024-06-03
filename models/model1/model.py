import torch
import torchvision.models as models
import torch.nn as nn
from torch.nn.functional import log_softmax
from helpers import strip_caption


class CNN(nn.Module):

    def __init__(self, embedding_size: int, dropout=0.5):
        super(CNN, self).__init__()

        self.resnet = models.resnet50(weights=models.resnet.ResNet50_Weights.IMAGENET1K_V2)

        # freeze network (no learning will be done)
        for param in self.resnet.parameters():
            param.requires_grad = False

        # modify the last layer (fully connected) which will have learnable parameters
        self.resnet.fc = nn.Linear(self.resnet.fc.in_features, embedding_size)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(dropout)

    def forward(self, images):
        features = self.resnet(images)
        return self.dropout(self.relu(features))
    

class RNN(nn.Module):

    def __init__(self, embedding_size: int, hidden_size: int, vocabulary_size: int, num_layers: int, dropout=0.5):
        super(RNN, self).__init__()

        self.embed = nn.Embedding(vocabulary_size, embedding_size)
        self.lstm = nn.LSTM(embedding_size, hidden_size, num_layers)
        self.linear = nn.Linear(hidden_size, vocabulary_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, features, captions):
        # create the embeddings for the captions 
        embeddings = self.dropout(self.embed(captions)) # (seq_length, batch_size, embedding size)
        
        # concatenate the output of the encoder at the beginning of the embeddings
        # features - (batch_size, embedding_size) ===unsqueeze===> (1, batch_size, embedding_size)
        embeddings = torch.cat((features.unsqueeze(0), embeddings), dim=0)
        hiddens, _ = self.lstm(embeddings)
        outputs = self.linear(hiddens)
        return outputs


class Model(nn.Module):

    def __init__(self, embeddding_size: int, hidden_size: int, vocabulary_size: int, num_layers: int, dropout=0.5):
        super(Model, self).__init__()
        self.cnn = CNN(embeddding_size, dropout)
        self.rnn = RNN(embeddding_size, hidden_size, vocabulary_size, num_layers, dropout)

    def forward(self, images, captions):
        features = self.cnn(images)
        return self.rnn(features, captions)
    
    def inference(self, image, vocabulary, max_length=50):
        """
        Get raw encoded caption.

        :param image: tensor image with the corresponding transforms already applied
        :param vocabulary: the vocabulary used to train the model
        :param max_length: the maximum length of the captions
        """

        result_caption = []

        with torch.no_grad():
            image = torch.unsqueeze(image, dim=0)
            x = self.cnn(image).unsqueeze(0)
            states = None

            for _ in range(max_length):
                hiddens, states = self.rnn.lstm(x, states)
                output = self.rnn.linear(hiddens.squeeze(0))
                predicted = output.argmax(1)
                result_caption.append(predicted.item())
                x = self.rnn.embed(predicted).unsqueeze(0)

                if vocabulary.decode(str(predicted.item())) == '<end>':
                    break

            return result_caption

    def caption_image(self, image, vocabulary, max_length=50):
        """
        Get striped and decoded caption.

        :param image: tensor image with the corresponding transforms already applied
        :param vocabulary: the vocabulary used to train the model
        :param max_length: the maximum length of the captions
        """

        result_caption = self.inference(image, vocabulary, max_length)

        start_val = vocabulary.encode('<start>')
        pad_val = vocabulary.encode('<pad>')
        end_val = vocabulary.encode('<end>')

        return [vocabulary.decode(idx) for idx in result_caption if idx not in { start_val, pad_val, end_val }]
    
    def caption_image_beam_search(self, image, vocabulary, device, max_length=50, beam_size=3):
        """
        
        :param image: tensor image with the corresponding transforms already applied
        :param vocabulary: the vocabulary used to train the model
        :param max_length: the maximum length of the captions
        :param beam_size: the size for the beam search
        """
    
        sequences = []
        complete_sequences = []

        # set start scrore to 0 to all beams so it won't influence the next pick
        scores = torch.zeros(beam_size, 1).to(device)
        complete_sequences_scores = []

        with torch.no_grad():
            image = torch.unsqueeze(image, dim=0)
            x = self.cnn(image).unsqueeze(0).to(device)

            # repeat the first element in sequence just so you have the right dimensions
            x = x.repeat(1, beam_size, 1)

            states = None

            for i in range(max_length):
                hiddens, states = self.rnn.lstm(x, states)

                output = self.rnn.linear(hiddens.squeeze(0)) # squeeze the sequence dimension (dim=0)
                output = log_softmax(output, dim=1) # we use log_softmax so we can add probabilities together 

                output = scores.expand_as(output) + output

                # first token that is generated should be <start>
                if i == 0:
                    # first prediction has to be <start> to all of them, so I can take only from the first 
                    # element considering that the first input was duplicated on all beams 
                    predicted = output[0].argmax(0)

                    # we put the start at the begining of all beams
                    sequences = torch.LongTensor([predicted.item()] * beam_size).unsqueeze(0).to(device) # (1, beam_size) 1 is seq_len and beam_size will act as a batch
                    
                    # create embeddings for the next input
                    x = self.rnn.embed(sequences)

                    # permuting for easier operations
                    sequences = torch.permute(sequences, (1, 0)) # (seq_length, beam_size) => (beam_size, seq_length)

                    continue
                if i == 1:
                    # take in consideration only the predictions of the first one(they are all the same for first step)
                    top_k_scores, top_k_indices = output[0].topk(beam_size, 0)
                    top_k_indices = top_k_indices + torch.arange(beam_size).to(device) * len(vocabulary)
                else:
                    # get top k scores and indices
                    top_k_scores, top_k_indices = output.view(-1).topk(beam_size, 0)

                prev_word_indices = top_k_indices // len(vocabulary) # get the index of the word in the beam selection (index of the word that generated this word)
                next_word_indices = top_k_indices % len(vocabulary) # get the index of the word in the vocabulary (the next word)
                
                # add new words to their coresponding sequences
                sequences = torch.cat((sequences[prev_word_indices], next_word_indices.unsqueeze(1)), dim=1).to(device)

                # check which sequences are complete (store the indices which are complete/incomplete from the sequences list)
                incomplete_indices = [ind for ind, next_word in enumerate(next_word_indices) if next_word != vocabulary.encode('<end>')]
                complete_indices = list(set(range(len(next_word_indices))) - set(incomplete_indices))

                # set aside complete sequences
                if len(complete_indices) > 0:
                    complete_sequences.extend(sequences[complete_indices].tolist())
                    complete_sequences_scores.extend(top_k_scores[complete_indices])
                beam_size -= len(complete_indices)  # reduce beam_size accordingly

                if beam_size == 0:
                    break
                
                # continue with only what is incomplete
                sequences = sequences[incomplete_indices]
                scores = scores[incomplete_indices]
                h, c = states
                h = h[:,prev_word_indices[incomplete_indices]]
                c = c[:,prev_word_indices[incomplete_indices]]
                states = (h, c)

                x = self.rnn.embed(next_word_indices[incomplete_indices].unsqueeze(1).permute((1, 0)))


            max_score_index = complete_sequences_scores.index(max(complete_sequences_scores))
            decoded_caption = [vocabulary.decode(idx) for idx in complete_sequences[max_score_index]]
            decoded_caption = vocabulary.strip_decoded(decoded_caption)
            return decoded_caption, complete_sequences
        
if __name__ == '__main__':
    from vocabulary import Vocabulary
    from helpers import load_checkpoint
    import os
    import torchvision.transforms as transforms
    from PIL import Image

    vocabulary = Vocabulary(dataset='flickr8k', vocabulary_folder='dataset')
    vocabulary_size = len(vocabulary)
    model = Model(256, 256, vocabulary_size, 4)
    load_checkpoint(torch.load(os.path.join('checkpoints', '27-04-2024T01-07-12_checkpoint.pth.tar')), model)
    model.eval()


    device = torch.device('cpu')    

    transform = transforms.Compose(
        [
            transforms.Resize((232, 232), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.CenterCrop((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ]
    )

    # img = Image.open("C:\\Users\\andre\\Desktop\\folders\\coco\\train2014\\COCO_train2014_000000000071.jpg")
    img = Image.open("C:\\Users\\andre\\Desktop\\folders\\flickr8k\\191003284_1025b0fb7d.jpg")
    best, all = model.caption_image_beam_search(transform(img), vocabulary, device, 50, beam_size=5)
    print(best)
    # for one in all:
    #     print(' '.join([vocabulary.decode(i) for i in one]))
    # print("Best")
    # print(' '.join(best))



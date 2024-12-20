import torch.backends.cudnn as cudnn
import torch.optim
import torch.utils.data
import torchvision.transforms as transforms
from datasets import *
from utils import *
from nltk.translate.bleu_score import corpus_bleu
from nltk.translate.meteor_score import meteor_score, single_meteor_score
from metrics.cider.cider import Cider
from metrics.rouge.rouge import Rouge
import torch.nn.functional as F
from tqdm import tqdm

# Parameters
data_folder = 'splits'  # folder with data files saved by create_input_files.py
data_name = 'coco_5_cap_per_img_5_min_word_freq'  # base name shared by data files
checkpoint = '02-05-2024T14-44-21_checkpoint_coco_5_cap_per_img_5_min_word_freq.pth.tar'  # model checkpoint
word_map_file = 'splits\\WORDMAP_coco_5_cap_per_img_5_min_word_freq.json'  # word map, ensure it's the same the data was encoded with and the model was trained with
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  # sets device for model and PyTorch tensors
cudnn.benchmark = True  # set to true only if inputs to model are fixed size; otherwise lot of computational overhead

# Load model
checkpoint = torch.load(checkpoint)
decoder = checkpoint['decoder']
decoder = decoder.to(device)
decoder.eval()
encoder = checkpoint['encoder']
encoder = encoder.to(device)
encoder.eval()

# Load word map (word2ix)
with open(word_map_file, 'r') as j:
    word_map = json.load(j)
rev_word_map = {v: k for k, v in word_map.items()}
vocab_size = len(word_map)

# Normalization transform
normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])


def evaluate(split, beam_size):
    """
    Evaluation

    :param beam_size: beam size at which to generate captions for evaluation
    :return: BLEU-4 score
    """
    assert split in { 'TEST', 'VAL' }

    # DataLoader
    loader = torch.utils.data.DataLoader(
        CaptionDataset(data_folder, data_name, split, transform=transforms.Compose([normalize])),
        batch_size=1, shuffle=True, num_workers=0, pin_memory=True)


    # Lists to store references (true captions), and hypothesis (prediction) for each image
    # If for n images, we have n hypotheses, and references a, b, c... for each image, we need -
    # references = [[ref1a, ref1b, ref1c], [ref2a, ref2b], ...], hypotheses = [hyp1, hyp2, ...]
    references = list()
    hypotheses = list()

    rev_word_map = {v: k for k, v in word_map.items()}

    # For each image
    for i, (image, caps, caplens, allcaps) in enumerate(
            tqdm(loader, desc='EVALUATING AT BEAM SIZE ' + str(beam_size))):

        k = beam_size

        # Move to GPU device, if available
        image = image.to(device)  # (1, 3, 256, 256)

        # Encode
        encoder_out = encoder(image)  # (1, enc_image_size, enc_image_size, encoder_dim)
        enc_image_size = encoder_out.size(1)
        encoder_dim = encoder_out.size(3)

        # Flatten encoding
        encoder_out = encoder_out.view(1, -1, encoder_dim)  # (1, num_pixels, encoder_dim)
        num_pixels = encoder_out.size(1)

        # We'll treat the problem as having a batch size of k
        encoder_out = encoder_out.expand(k, num_pixels, encoder_dim)  # (k, num_pixels, encoder_dim)

        # Tensor to store top k previous words at each step; now they're just <start>
        k_prev_words = torch.LongTensor([[word_map['<start>']]] * k).to(device)  # (k, 1)

        # Tensor to store top k sequences; now they're just <start>
        seqs = k_prev_words  # (k, 1)

        # Tensor to store top k sequences' scores; now they're just 0
        top_k_scores = torch.zeros(k, 1).to(device)  # (k, 1)

        # Lists to store completed sequences and scores
        complete_seqs = list()
        complete_seqs_scores = list()

        # Start decoding
        step = 1
        h, c = decoder.init_hidden_state(encoder_out)

        # s is a number less than or equal to k, because sequences are removed from this process once they hit <end>
        while True:

            embeddings = decoder.embedding(k_prev_words).squeeze(1)  # (s, embed_dim)

            awe, _ = decoder.attention(encoder_out, h)  # (s, encoder_dim), (s, num_pixels)

            gate = decoder.sigmoid(decoder.f_beta(h))  # gating scalar, (s, encoder_dim)
            awe = gate * awe

            h, c = decoder.decode_step(torch.cat([embeddings, awe], dim=1), (h, c))  # (s, decoder_dim)

            scores = decoder.fc(h)  # (s, vocab_size)
            scores = F.log_softmax(scores, dim=1)

            # Add
            scores = top_k_scores.expand_as(scores) + scores  # (s, vocab_size)

            # For the first step, all k points will have the same scores (since same k previous words, h, c)
            if step == 1:
                top_k_scores, top_k_words = scores[0].topk(k, 0, True, True)  # (s)
            else:
                # Unroll and find top scores, and their unrolled indices
                top_k_scores, top_k_words = scores.view(-1).topk(k, 0, True, True)  # (s)

            # Convert unrolled indices to actual indices of scores
            prev_word_inds = top_k_words // vocab_size  # (s)
            next_word_inds = top_k_words % vocab_size  # (s)

            # Add new words to sequences
            seqs = torch.cat([seqs[prev_word_inds], next_word_inds.unsqueeze(1)], dim=1)  # (s, step+1)

            # Which sequences are incomplete (didn't reach <end>)?
            incomplete_inds = [ind for ind, next_word in enumerate(next_word_inds) if
                               next_word != word_map['<end>']]
            complete_inds = list(set(range(len(next_word_inds))) - set(incomplete_inds))

            # Set aside complete sequences
            if len(complete_inds) > 0:
                complete_seqs.extend(seqs[complete_inds].tolist())
                complete_seqs_scores.extend(top_k_scores[complete_inds])
            k -= len(complete_inds)  # reduce beam length accordingly

            # Proceed with incomplete sequences
            if k == 0:
                break
            seqs = seqs[incomplete_inds]
            h = h[prev_word_inds[incomplete_inds]]
            c = c[prev_word_inds[incomplete_inds]]
            encoder_out = encoder_out[prev_word_inds[incomplete_inds]]
            top_k_scores = top_k_scores[incomplete_inds].unsqueeze(1)
            k_prev_words = next_word_inds[incomplete_inds].unsqueeze(1)

            # Break if things have been going on too long
            if step > 50:
                break
            step += 1

        i = complete_seqs_scores.index(max(complete_seqs_scores))
        seq = complete_seqs[i]

        # References
        img_caps = allcaps[0].tolist()
        img_captions = list(
            map(lambda c: [w for w in c if w not in {word_map['<start>'], word_map['<end>'], word_map['<pad>']}],
                img_caps))  # remove <start> and pads
        references.append(img_captions)

        # Hypotheses

        hypothesis = [w for w in seq if w not in {word_map['<start>'], word_map['<end>'], word_map['<pad>']}]
        hypotheses.append(hypothesis)

        # create word version for result file
        # words = [rev_word_map[ind] for ind in hypothesis]

        assert len(references) == len(hypotheses)
        
    # Transform to sentences
    hypotheses = [[rev_word_map[ind] for ind in hyp] for hyp in hypotheses]
    references = [[[rev_word_map[ind] for ind in ref] for ref in refs] for refs in references]

    # Calculate BLEU-n scores
    bleu1 = corpus_bleu(references, hypotheses, weights=(1, 0, 0, 0))
    bleu2 = corpus_bleu(references, hypotheses, weights=(0.5, 0.5, 0, 0))
    bleu3 = corpus_bleu(references, hypotheses, weights=(0.33, 0.33, 0.33, 0))
    bleu4 = corpus_bleu(references, hypotheses, weights=(1.25, 0.25, 0.25, 0.25))

    # Calculate METEOR score
    m_scores = []
    for refs, hyp in zip(references, hypotheses):
        m_scores.append([single_meteor_score(r, hyp) for r in refs])
    
    m_scores = [sum(scores) / len(scores) for scores in m_scores]
    meteor = sum(m_scores) / len(m_scores)

    hypotheses = [' '.join(hyp) for hyp in hypotheses]
    references = [[' '.join(ref) for ref in refs] for refs in references]

    # Calculate ROUGE-L score
    rou = Rouge()
    rouge, _ = rou.compute_score(references, hypotheses)

    # Calculate CIDEr score
    cid = Cider()
    cider, _ = cid.compute_score(references, hypotheses)

    return bleu1, bleu2, bleu3, bleu4, meteor, rouge, cider


if __name__ == '__main__':
    results = []

    splits = ['TEST', 'VAL']
    beam_sizes = [1, 3, 5]

    for beam_size in beam_sizes:
        for split in splits:
            bleu1, bleu2, bleu3, bleu4, meteor, rouge, cider = evaluate(split=split, beam_size=beam_size)
            print(f'Evaluation for {split} split with beam size of {beam_size}:\n')
            print(f'\tBLEU-1 score: {round(bleu1 * 100, 1)}')
            print(f'\tBLEU-2 score: {round(bleu2 * 100, 1)}')
            print(f'\tBLEU-3 score: {round(bleu3 * 100, 1)}')
            print(f'\tBLEU-4 score: {round(bleu4 * 100, 1)}')
            print(f'\tMETEOR score: {round(meteor * 100, 1)}')
            print(f'\tROUGE-L score: {round(rouge * 100, 1)}')
            print(f'\tCIDEr score: {round(cider * 10, 2) * 10}')
            print('')
            
            results.append(
                {
                    "split": split,
                    "beam_size": beam_size,
                    "bleu1": round(bleu1 * 100, 1),
                    "bleu2": round(bleu2 * 100, 1),
                    "bleu3": round(bleu3 * 100, 1),
                    "bleu4": round(bleu4 * 100, 1),
                    "meteor": round(meteor * 100, 1),
                    "rouge": round(rouge * 100, 1),
                    "cider": round(cider * 100, 1),
                }
            )

    with open(os.path.join('results', 'evaluation_results.json'), 'w') as f:
        json.dump(results, f)

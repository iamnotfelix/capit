import json
import os


class Vocabulary:

    def __init__(self, dataset: str, vocabulary_folder: str) -> None:
        """
        :param dataset: name of dataset, one of 'coco', 'flickr8k', 'flickr30k'
        :param vocabulary_folder: folder where the vocabulary is located
        """
        
        self.dataset = dataset.lower()

        # check dataset and split
        assert dataset in { 'flickr8k', 'flickr30k', 'coco' }

        vocabulary_path = os.path.join(vocabulary_folder, f'vocabulary_{dataset}.json')

        # read vocabulary
        with open(vocabulary_path, 'r') as f:
            self.vocabulary = json.load(f)

    def __len__(self):
        return len(self.vocabulary['stoi'])

    def decode(self, value: int):
        if str(value) in self.vocabulary['itos']:
            return self.vocabulary['itos'][str(value)]
        return '<unk>'

    def encode(self, value: str):
        if value in self.vocabulary['stoi']:
            return self.vocabulary['stoi'][value]
        return self.vocabulary['stoi']['<unk>']
    
    def strip_encoded(self, caption):
        return list(filter(lambda token: token != self.vocabulary['<start>'] 
               and token != self.vocabulary['<pad>'] 
               and token != self.vocabulary['<end>'], caption))

    def strip_decoded(self, caption):
        return list(filter(lambda token: token != '<start>' 
               and token != '<pad>' 
               and token != '<end>', caption))


if __name__ == '__main__':

    vocabulary = Vocabulary(
        dataset='flickr8k', 
        vocabulary_folder='dataset'
    )

    print(vocabulary.decode(0))
    print(vocabulary.decode(2631))
    print(vocabulary.decode(12345))

    print(vocabulary.encode('<pad>'))
    print(vocabulary.encode('<unk>'))
    print(vocabulary.encode('cat22'))

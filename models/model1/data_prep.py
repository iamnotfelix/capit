import os
import random
import json
from tqdm import tqdm
from collections import Counter

def create_input_files(dataset: str, split_json_path: str, captions_per_image: int, min_word_freq: int, output_folder: str, cap_max_len=100):

    """
    Creates input files for training, validation, and test data.

    :param dataset: name of dataset, one of 'coco', 'flickr8k', 'flickr30k'
    :param split_json_path: path of split JSON file with splits and captions
    :param captions_per_image: number of captions to sample per image
    :param min_word_freq: words occuring less frequently than this threshold are marked as <unk>
    :param output_folder: folder to save files
    :param cap_max_len: specify a maximum length for captions (captions with a bigger len will be excluded; all other captions will be padded to that length)
    """
    
    dataset = dataset.lower()

    # check that the dataset provided is one of the following
    assert dataset in {'coco', 'flickr8k', 'flickr30k'}

    # open JSON containing splits
    with open(split_json_path, 'r') as f:
        data = json.load(f)

    # training data
    train_image_paths = []
    train_image_captions = []

    # validation data
    val_image_paths = []
    val_image_captions = []

    # testing data
    test_image_paths = []
    test_image_captions = []

    # word counter used for construction of vocabulary
    word_counter = Counter()
    
    print("\Constructing vocabulary and storing to file...\n")

    # iterate over images and captions
    for img in tqdm(data['images']):
        captions = []
        for cap in img['sentences']:
            # update the word counter
            word_counter.update(cap['tokens'])
            if len(cap['tokens']) <= cap_max_len:
                captions.append(cap['tokens'])

        # if no captions could be resolved for an image, ignore it
        if len(captions) == 0:
            continue

        # create path for image
        path = os.path.join(img['filepath'], img['filename']) if dataset == 'coco' else img['filename']

        # append images and captions to the corresponding array (according to theri split)
        if img['split'] in {'train', 'restval'}:
            train_image_paths.append(path)
            train_image_captions.append(captions)
        elif img['split'] in {'val'}:
            val_image_paths.append(path)
            val_image_captions.append(captions)
        elif img['split'] in {'test'}:
            test_image_paths.append(path)
            test_image_captions.append(captions)

    # check that there are as many captions sets as images
    assert len(train_image_paths) == len(train_image_captions)
    assert len(val_image_paths) == len(val_image_captions)
    assert len(test_image_paths) == len(test_image_captions)

    # create word map and include only words that have a frequency higher than the given
    words = [w for w in word_counter.keys() if word_counter[w] > min_word_freq]
    word_map = {k: v + 1 for v, k in enumerate(words)}

    # add special tokens
    word_map['<unk>'] = len(word_map) + 1
    word_map['<start>'] = len(word_map) + 1
    word_map['<end>'] = len(word_map) + 1
    word_map['<pad>'] = 0

    # create a reveresed map (for mapping from index to word)
    from_index_to_word = {v: k for k, v in word_map.items()}

    # create a base name for all output files
    base_filename = dataset

    # create vocabulary (include both maps into the vocabulary)
    vocabulary = {
        "stoi": word_map,
        "itos": from_index_to_word,
    }

    # save vocabulary to a JSON
    with open(os.path.join(output_folder, 'vocabulary_' + base_filename + '.json'), 'w') as f:
        json.dump(vocabulary, f)

    random.seed(43)

    for img_paths, img_captions, split in [(train_image_paths, train_image_captions, 'train'),
                                            (val_image_paths, val_image_captions, 'val'),
                                            (test_image_paths, test_image_captions, 'test')]:
        
        print("\nReading %s data and storing to file...\n" % split)

        # will have the form of:
        # [
        #   [img_path, [cap_encoding, ... , cap_encoding]]
        #   .....
        #   [img_path, [cap_encoding, ... , cap_encoding]]
        # ]
        images_and_captions = []
        with tqdm(total=len(img_paths)) as pb:
            for img_path, caps in tqdm(zip(img_paths, img_captions)):
                
                # sample captions
                # if we have less captions than the provided limit duplicate some randomly 
                if len(caps) < captions_per_image:
                    captions = caps + [random.choice(caps) for _ in range(captions_per_image - len(caps))]
                else:
                    captions = random.sample(caps, k=captions_per_image)

                # check the number of captions
                assert len(captions) == captions_per_image

                for cap in captions:
                    # encode captions
                    encoded_cap = [word_map['<start>']] + [word_map.get(word, word_map['<unk>']) for word in cap] + [
                        word_map['<end>']] + [word_map['<pad>']] * (cap_max_len - len(cap))

                    images_and_captions.append([img_path, encoded_cap])

                pb.update(1)

        # save data to JSON file
        with open(os.path.join(output_folder, split + '_data_' + base_filename + '.json'), 'w') as f:
            json.dump(images_and_captions, f)
        


if __name__ == '__main__':
    create_input_files(
        dataset='flickr8k', 
        split_json_path=os.path.join('..', 'data','split_json_files', 'dataset_flickr8k.json'),
        captions_per_image=5,
        min_word_freq=5, 
        output_folder='dataset',
        cap_max_len=38,
    )

    # longest caption for flickr8k is 37 => 38 so we have exactly 40 after adding <start> and <end>
    # longest caption for flickr30k is 78
    # longest caption for coco is 49
    # this is top 20 longest captions for flickr30k [55, 56, 58, 58, 60, 60, 61, 61, 63, 63, 63, 64, 64, 65, 69, 70, 70, 72, 73, 78]
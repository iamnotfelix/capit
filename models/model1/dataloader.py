import json
import os
from PIL import Image 
import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Dataset


class CustomDataset(Dataset):
    def __init__(self, dataset: str, dataset_folder: str, split: str, split_folder: str, captions_per_image: int, transform=None):
        """
        :param dataset: name of dataset, one of 'coco', 'flickr8k', 'flickr30k'
        :param dataset_folder: folder where dataset is stored
        :param data_name: base name of processed datasets
        :param split: split, one of 'train', 'val', or 'test'
        :param transform: image transform pipeline
        """

        self.dataset = dataset.lower()
        self.split = split.lower()

        # check dataset and split
        assert dataset in { 'flickr8k', 'flickr30k', 'coco' }
        assert split in { 'train', 'val', 'test' }

        self.dataset_folder = dataset_folder
        self.split_folder = split_folder
        self.captions_per_image = captions_per_image
        self.transform = transform

        # create paths 
        split_path = os.path.join(split_folder, f'{split}_data_{dataset}.json')

        # read data
        with open(split_path, 'r') as f:
            self.data = json.load(f)


    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        img_name = self.data[index][0]
        caption = torch.LongTensor(self.data[index][1])

        img = Image.open(os.path.join(self.dataset_folder, img_name)).convert("RGB")

        if self.transform is not None:
            img = self.transform(img)

        # if split is 'train' return an image and a caption
        if self.split == 'train':
            return img, caption
        
        # if split is 'val' or 'test' also return all captions related to one image
        start_idx = index // self.captions_per_image 
        all_captions = torch.LongTensor([pair[1] for pair in self.data[start_idx : start_idx + self.captions_per_image]])
        
        return img, caption, all_captions

# class MyCollate:
#     def __init__(self, pad_idx):
#         self.pad_idx = pad_idx

#     def __call__(self, batch):
#         imgs = [item[0].unsqueeze(0) for item in batch]
#         imgs = torch.cat(imgs, dim=0)
#         targets = [item[1] for item in batch]
#         targets = pad_sequence(targets, batch_first=False, padding_value=self.pad_idx)

#         return imgs, targets


if __name__ == "__main__":
    transform = transforms.Compose(
        [transforms.Resize((224, 224)), transforms.ToTensor(),]
    )

    dataset = CustomDataset(
        dataset='flickr8k',
        dataset_folder=os.path.join('..','data','flickr8k','images'),
        split='train',
        split_folder='dataset',
        captions_per_image=5,
        transform=transform
    )

    loader = DataLoader(
        dataset=dataset,
        batch_size=2,
        num_workers=8,
        shuffle=True,
        pin_memory=True,
    )

    for idx, (imgs, caption) in enumerate(loader):
        print(caption)
        print(caption.shape)
        if idx == 0:
            break
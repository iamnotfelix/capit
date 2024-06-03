import torch
import os
import torchvision.transforms as transforms
from helpers import load_checkpoint, strip_caption
from dataloader import CustomDataset
from model import Model
from torch.utils.data import DataLoader
from vocabulary import Vocabulary


def test():
    dataset='flickr8k'
    vocabulary_folder='dataset'
    split_folder='dataset'
    dataset_folder=os.path.join('..','data','flickr8k','images')
    captions_per_image=5   # WARNING: if changed, the data_prep file needs to be run again with the new value

    num_workers = 8

    batch_size = 1
    embedding_size = 256
    hidden_size = 256
    num_layers = 1

    transform = transforms.Compose(
        [
            transforms.Resize((232, 232), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.CenterCrop((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ]
    )


    test_set = CustomDataset(dataset=dataset, dataset_folder=dataset_folder, split='train',
        split_folder=split_folder, captions_per_image=captions_per_image, transform=transform)
    
    test_loader = DataLoader(dataset=test_set, batch_size=batch_size, num_workers=num_workers,
        shuffle=True, pin_memory=True)

    
    torch.backends.cudnn.benchmark = True
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    vocabulary = Vocabulary(dataset=dataset, vocabulary_folder=vocabulary_folder)
    vocabulary_size = len(vocabulary)
    

    model = Model(embedding_size, hidden_size, vocabulary_size, num_layers).to(device)
    load_checkpoint(torch.load(os.path.join("checkpoints", "25-04-2024T19-38-13_checkpoint.pth.tar")), model)
    model.eval()

    for _ in range(3):

        img, caption = next(iter(test_loader))
        reference_caption = " ".join(
        strip_caption(
            [vocabulary.decode(i) for i in torch.squeeze(caption, dim=0).tolist()]
        )
    )
        predicted_caption = " ".join(
            strip_caption(
                model.caption_image(torch.squeeze(img, dim=0).to(device), vocabulary)
            )
        )

        print(f'Reference: {reference_caption}')
        print(f'Predicted: {predicted_caption}')
        # print(" ".join([dataset.vocab.itos[i] for i in caption.transpose(0, 1).squeeze(0).tolist()]))
        # print(" ".join(model.caption_image(img.to(device), dataset.vocab)))


if __name__ == "__main__":
    test()
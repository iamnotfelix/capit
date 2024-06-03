import os
import time
import torch
from tqdm import tqdm
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from helpers import save_checkpoint
from dataloader import CustomDataset
from model import Model
from vocabulary import Vocabulary
from nltk.translate.bleu_score import corpus_bleu


def main(
        # Dataset info
        dataset='flickr8k',
        vocabulary_folder='dataset',
        split_folder='dataset',
        dataset_folder=os.path.join('..','data','flickr8k','images'),
        captions_per_image=5,   # WARNING: if changed, the data_prep file needs to be run again with the new value

        # Training parameters
        save_model=False,
        num_workers = 8,

        # Hyperparameters
        num_epochs=100,
        batch_size = 32,
        embedding_size = 256,
        hidden_size = 256,
        num_layers = 1,
        learning_rate = 0.0003,
        dropout = 0.5,
):
   

    transform = transforms.Compose(
        [
            transforms.Resize((232, 232), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.CenterCrop((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ]
    )

    # Vocabulary

    vocabulary = Vocabulary(dataset=dataset, vocabulary_folder=vocabulary_folder)
    vocabulary_size = len(vocabulary)

    # Training data

    train_set = CustomDataset(dataset=dataset, dataset_folder=dataset_folder, split='train',
        split_folder=split_folder, captions_per_image=captions_per_image, transform=transform)
    
    train_loader = DataLoader(dataset=train_set, batch_size=batch_size, num_workers=num_workers,
        shuffle=True, pin_memory=True)

    torch.backends.cudnn.benchmark = True
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    model = Model(embedding_size, hidden_size, vocabulary_size, num_layers, dropout).to(device)
    criterion = nn.CrossEntropyLoss(ignore_index=vocabulary.encode('<pad>')).to(device)
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)


    model.train()

    for epoch in range(num_epochs):

        for idx, (imgs, captions) in tqdm(
            enumerate(train_loader), total=len(train_loader), leave=True, desc=f'Epoch: {epoch + 1}/{num_epochs} - Training'):
            
            # move to GPU if available
            imgs = imgs.to(device)
            captions = captions.to(device)

            # (batch_size, seq_length) => (seq_length, batch_size)
            captions = torch.permute(captions, (1, 0))

            # forward propagation (removing last token from the sequence so outputs size matches later)
            outputs = model(imgs, captions[:-1])

            # reshaping outputs from (batch_size, sequence_length, features) to (batch_size * sequence_length, features)
            outputs = outputs.reshape(-1, outputs.shape[2])
            captions = captions.reshape(-1)

            loss = criterion(outputs, captions)

            # backwarrd propagation
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    if save_model:
        checkpoint = {
            "state_dict": model.state_dict(),
            "optimizer": optimizer.state_dict(),
        }
        save_checkpoint(checkpoint)

if __name__ == "__main__":
    main(
        # Dataset info
        dataset='flickr8k',
        vocabulary_folder='dataset',
        split_folder='dataset',
        dataset_folder=os.path.join('..','data','flickr8k','images'),
        captions_per_image=5,   # WARNING: if changed, the data_prep file needs to be run again with the new value

        # Training parameters
        save_model=True,
        num_workers = 8,

        # Hyperparameters
        num_epochs=10,
        batch_size = 32,
        embedding_size = 256,
        hidden_size = 256,
        num_layers = 1,
        learning_rate = 0.0003,
        dropout = 0.5,
    )
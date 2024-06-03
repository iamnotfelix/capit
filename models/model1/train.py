import os
import time
import torch
import wandb
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
from nltk.translate.meteor_score import meteor_score


def main(
        # Dataset info
        dataset='flickr8k',
        vocabulary_folder='dataset',
        split_folder='dataset',
        dataset_folder=os.path.join('..','data','flickr8k','images'),
        captions_per_image=5,   # WARNING: if changed, the data_prep file needs to be run again with the new value
        cap_max_len=50,         # WARNING: this indicates the length of the captions, this value has to correspond with the one in data_prep

        # Training parameters
        save_model=False,
        num_workers = 8,
        validation_enabled=True,
        validation_freq=5,

        # Hyperparameters
        num_epochs=100,
        batch_size = 32,
        embedding_size = 256,
        hidden_size = 256,
        num_layers = 1,
        learning_rate = 0.0003,
        dropout = 0.5,
):
   
    start_time = time.time()

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

    # Validation data

    val_set = CustomDataset(dataset=dataset, dataset_folder=dataset_folder, split='val',
        split_folder=split_folder, captions_per_image=captions_per_image, transform=transform)
    
    val_loader = DataLoader( dataset=val_set, batch_size=batch_size, num_workers=num_workers,
        shuffle=True, pin_memory=True)
    

    torch.backends.cudnn.benchmark = True
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    model = Model(embedding_size, hidden_size, vocabulary_size, num_layers, dropout).to(device)
    criterion = nn.CrossEntropyLoss(ignore_index=vocabulary.encode('<pad>')).to(device)
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)


    model.train()

    for epoch in range(num_epochs):

        loss = train(
            train_loader=train_loader,
            device=device,
            model=model,
            criterion=criterion,
            optimizer=optimizer,
            epoch=epoch,
            num_epochs=num_epochs,
        )

        if validation_enabled and epoch % validation_freq == validation_freq - 1:
            last_bleu1_score, last_bleu4_score, last_meteor_score = validate(
                val_loader=val_loader,
                device=device,
                model=model,
                vocabulary=vocabulary,
                epoch=epoch,
                num_epochs=num_epochs,
                cap_max_len=cap_max_len,
            )
            wandb.log({"BLEU-1": last_bleu1_score, "BLEU-4": last_bleu4_score, "METEOR": last_meteor_score})

        wandb.log({"loss": loss})

        # TODO: save better models (create checkpoints)

    if save_model:
        checkpoint = {
            'state_dict': model.state_dict(),
            'optimizer': optimizer.state_dict(),
        }
        hyperparameters = {
            'dataset': dataset,
            'captions_per_image': captions_per_image,
            'cap_max_len': cap_max_len,
            'num_epochs': num_epochs,
            'batch_size': batch_size,
            'embedding_size': embedding_size,
            'hidden_size': hidden_size,
            'num_layers': num_layers,
            'learning_rate': learning_rate,
            'dropout': dropout,
        }
        save_checkpoint(checkpoint, hyperparameters)

    # compute training time
    seconds = int(time.time() - start_time)
    minutes = seconds // 60
    hours = minutes // 60
    minutes = minutes % 60
    seconds = seconds % 60
    print(f'\nTraining took: {hours}h {minutes}m {seconds}s\n')


def train(train_loader: DataLoader, device: torch.device, model: Model, criterion: nn.CrossEntropyLoss, optimizer: optim.Adam, epoch: int, num_epochs: int):

    losses = []

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

        losses.append(loss.item())

    loss = sum(losses) / len(train_loader)
    print(f'Epoch: {epoch + 1}/{num_epochs}: Loss - {loss}\n')

    return loss


def validate(val_loader: DataLoader, device: torch.device, model: Model, vocabulary: Vocabulary, epoch: int, num_epochs: int, cap_max_len: int):
    
    model.eval()

    references = list()
    hypothesis = list()

    with torch.no_grad():
        for idx, (imgs, _, all_captions) in tqdm(
            enumerate(val_loader), total=len(val_loader), leave=True, desc=f'Epoch: {epoch + 1}/{num_epochs} - Validation'):

            # move to GPU if available
            imgs = imgs.to(device)
            all_captions = all_captions.to(device)

            # Hypothesis

            for img in imgs:
                hypothesis.append(model.caption_image(img, vocabulary, cap_max_len))

            # References

            start_val = vocabulary.encode('<start>')
            pad_val = vocabulary.encode('<pad>')
            end_val = vocabulary.encode('<end>')

            for j in range(all_captions.shape[0]):
                img_caps = all_captions[j].tolist()
                img_captions = list(
                    map(lambda c: [vocabulary.decode(w) for w in c if w not in { start_val, pad_val, end_val }], img_caps))  # remove <start>, <end> and <pad>
                references.append(img_captions)

        # compute BLEU-n score
        bleu1_score = corpus_bleu(references, hypothesis, weights=(1, 0, 0, 0))
        bleu4_score = corpus_bleu(references, hypothesis, weights=(0.25, 0.25, 0.25, 0.25))

        m_scores = []
        for ref, hyp in zip(references, hypothesis):
            m_scores.append(meteor_score(ref, hyp))

        m_score = sum(m_scores) / len(references)

        print(f'Epoch: {epoch + 1}/{num_epochs}:\n\tBLEU-1 - {bleu1_score}\n\tBLEU-4 - {bleu4_score}\n\tMETEOR - {m_score}')

    model.train()

    return bleu1_score, bleu4_score, m_score

def wandb_train(config=None):

    ############## ENVIRONEMNT specific ##############
    vocabulary_folder = 'C:\\Users\\andre\\Desktop\\folders\\thesis\\playground\\imageCaptionModel\\showAndTell\\dataset'
    split_folder = 'C:\\Users\\andre\\Desktop\\folders\\thesis\\playground\\imageCaptionModel\\showAndTell\\dataset'
    dataset_folder = 'C:\\Users\\andre\\Desktop\\folders'

    captions_per_image = 5
    cap_max_len = 50
    
    save_model = True
    num_workers  =  8
    validation_enabled = True
    validation_freq = 5
    #################################################
    


    with wandb.init(config=config):
        config = wandb.config
        main(
            # Dataset info
            dataset=config['dataset'],
            vocabulary_folder=vocabulary_folder,
            split_folder=split_folder,
            dataset_folder=os.path.join(dataset_folder, config['dataset']),
            captions_per_image=captions_per_image,                              # WARNING: if changed, the data_prep file needs to be run again with the new value
            cap_max_len=cap_max_len,                                            # WARNING: this indicates the length of the captions, this value has to correspond with the one in data_prep

            # Training parameters
            save_model=save_model,
            num_workers=num_workers,
            validation_enabled=validation_enabled,
            validation_freq=validation_freq,

            # Hyperparameters
            num_epochs=config['num_epochs'],
            batch_size=config['batch_size'],
            embedding_size=config['embedding_size'],
            hidden_size=config['hidden_size'],
            num_layers=config['num_layers'],
            learning_rate=config['learning_rate'],
            dropout=config['dropout'],
        )

if __name__ == '__main__':

    sweep_config1 = {
        'method': 'random',
        'metric': {
            'name': 'loss',
            'goal': 'minimize'
        },
        'parameters': {
            'dataset': {
                'values': ['flickr30k'] # ['flickr8k', 'flickr30k', 'coco']
            },
            'num_epochs':{
                'values': [10] # [100]
            },
            'batch_size': {
                'values': [32, 50, 64] # [32, 64]
            },
            'embedding_size': {
                'values': [512] # [256, 512]
            },
            'hidden_size': {
                'values': [512] # [256, 512]
            },
            'num_layers': {
                'values': [2, 4, 8] # [2, 4, 8]
            },
            'learning_rate': {
                'values': [0.0003, 0.0004, 0.0005]
            },
            'dropout': {
                'values': [0.5]
            }
        }
    }

    wandb.login()
    sweep_id = wandb.sweep(sweep=sweep_config1, project='thesis')
    wandb.agent(sweep_id, wandb_train, count=8)

    # main(
    #     # Dataset info
    #     dataset='flickr8k',
    #     vocabulary_folder='dataset',
    #     split_folder='dataset',
    #     dataset_folder=os.path.join('..','data','flickr8k','images'),
    #     captions_per_image=5,   # WARNING: if changed, the data_prep file needs to be run again with the new value
    #     cap_max_len=50,         # WARNING: this indicates the length of the captions, this value has to correspond with the one in data_prep

    #     # Training parameters
    #     save_model=True,
    #     num_workers = 8,
    #     validation_enabled=True,
    #     validation_freq=5,

    #     # Hyperparameters
    #     num_epochs=20,
    #     batch_size = 32,
    #     embedding_size = 256,
    #     hidden_size = 256,
    #     num_layers = 1,
    #     learning_rate = 0.0003,
    #     dropout = 0.5,
    # )
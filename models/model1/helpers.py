import os
import json
import torch
from datetime import datetime


def save_checkpoint(state, hyperparams, base_folder='checkpoints'):
    date_str = datetime.now().strftime('%d-%m-%YT%H-%M-%S')
    
    with open(os.path.join(base_folder, date_str + '_hyperparams.json'), 'w') as f:
        json.dump(hyperparams, f)

    torch.save(state, os.path.join(base_folder, date_str + '_checkpoint.pth.tar'))


def load_checkpoint(checkpoint, model, optimizer=None):
    model.load_state_dict(checkpoint['state_dict'])
    if optimizer:
        optimizer.load_state_dict(checkpoint['optimizer'])


def strip_caption(caption: list):
    return filter(lambda token: token != '<start>' and token != '<pad>' and token != '<end>', caption)

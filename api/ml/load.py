import os
from functools import lru_cache
from dotenv import load_dotenv, find_dotenv

from .caption import ImageCaptioner
from ..dependencies.s3 import S3Client


load_dotenv(find_dotenv())

@lru_cache
def load_model(with_cuda=True):
    s3_client = S3Client(
        aws_access_key_id=os.environ.get('ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('SECRET_ACCESS_KEY'),
        region_name=os.environ.get('REGION'),
        bucket=os.environ.get('BUCKET'),
    )

    model = ImageCaptioner(
        s3_client=s3_client,
        # checkpoint_path=os.path.join('static', 'model.pth.tar'),
        checkpoint_path='C:\\Users\\andre\\Desktop\\folders\\thesis\\project\\api\\static\\model_.pth.tar',
        # word_map_path=os.path.join('static', 'wordmap.json'),
        word_map_path='C:\\Users\\andre\\Desktop\\folders\\thesis\\project\\api\\static\\wordmap.json',
        with_cuda=with_cuda,
    )

    return model


def get_model():
    return load_model(False)
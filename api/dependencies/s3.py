import boto3
from PIL import Image
from io import BytesIO


class S3Client(object):
    
    def __init__(self, aws_access_key_id, aws_secret_access_key, region_name, bucket):
        self.bucket = bucket
        self.s3 = boto3.client(
            's3', 
            aws_access_key_id=aws_access_key_id, 
            aws_secret_access_key=aws_secret_access_key, 
            region_name=region_name
        )
        

    def get(self, key):
        file_byte_string = self.s3.get_object(Bucket=self.bucket, Key=key)['Body'].read()
        return Image.open(BytesIO(file_byte_string))
    
    
    def delete(self, key):
        self.s3.delete_object(Bucket=self.bucket, Key=key)
    
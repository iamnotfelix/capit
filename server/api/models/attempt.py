import uuid
from django.db import models
from .user import User

def result_default():
    return {"status": "Results not computed yet!"}

class Attempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.TextField()
    result = models.JSONField(editable=False, default=result_default)
    score = models.PositiveSmallIntegerField(editable=False, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    created = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.id}"
    
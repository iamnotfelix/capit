import uuid
from django.db import models

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=128)
    email = models.EmailField()
    password = models.CharField(max_length=128)
    score = models.PositiveIntegerField(default=0)
    allowed_attempts = models.PositiveSmallIntegerField(default=3)
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}: {self.username}"

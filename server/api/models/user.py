import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager



class CustomUserManager(BaseUserManager):
    """
    Taken from docs: https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#a-full-example
    """
    def create_user(self, username, email=None, password=None):
        """
        Creates and saves a User with the given username, email and password.
        """
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None):
        """
        Creates and saves a superuser with the given username, email and password.
        """
        user = self.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(unique=True, max_length=128)
    email = models.EmailField()
    password = models.CharField(max_length=128)
    score = models.PositiveIntegerField(default=0)
    allowed_attempts = models.PositiveSmallIntegerField(default=3)
    created = models.DateField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.id}: {self.username}"
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


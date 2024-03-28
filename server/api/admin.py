from django.contrib import admin
from .models.attempt import Attempt
from .models.user import User

admin.site.register(Attempt)
admin.site.register(User)

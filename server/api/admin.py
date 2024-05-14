from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models.attempt import Attempt
from .models.user import User

admin.site.unregister(Group)
admin.site.register(User)
admin.site.register(Attempt)

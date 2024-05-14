from rest_framework import serializers
from ..models.user import User

class AuthSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'password']

from rest_framework import serializers
from ..models.attempt import Attempt
from .userSerializer import UserSerializer


class AttemptSerializer(serializers.ModelSerializer):

    ## uncomment this to add full info about the User in an Attempt
    # user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Attempt
        fields = '__all__'
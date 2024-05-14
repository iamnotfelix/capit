from rest_framework import serializers
from ..models.attempt import Attempt
from .userSerializers import UserSerializer


class AttemptSerializer(serializers.ModelSerializer):

    ## uncomment this to add full info about the User in an Attempt
    # user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Attempt
        fields = '__all__'


class AddAttemptSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attempt
        fields = ['image']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

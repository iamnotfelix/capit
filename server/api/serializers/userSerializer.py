from rest_framework import serializers
from ..models.user import User

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

    # id = serializers.UUIDField(read_only=True)
    # username = serializers.CharField(max_length=128)
    # email = serializers.EmailField()
    # password = serializers.CharField(max_length=128)
    # score = serializers.IntegerField(min_value=0)
    # allowed_attempts = serializers.IntegerField(min_value=0)
    # created = serializers.DateField(read_only=True)
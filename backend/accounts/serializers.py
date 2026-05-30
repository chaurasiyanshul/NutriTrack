from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['age', 'gender', 'weight_kg', 'activity_level', 'dietary_preference']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)
    age = serializers.IntegerField(write_only=True, required=False)
    gender = serializers.ChoiceField(choices=UserProfile.GENDER_CHOICES, write_only=True, required=False)
    weight_kg = serializers.FloatField(write_only=True, required=False)
    activity_level = serializers.ChoiceField(choices=UserProfile.ACTIVITY_CHOICES, write_only=True, required=False)
    dietary_preference = serializers.ChoiceField(choices=UserProfile.DIET_CHOICES, write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name',
            'age', 'gender', 'weight_kg', 'activity_level', 'dietary_preference'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=data.get('email', '')).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        return data

    def create(self, validated_data):
        profile_fields = {}
        for field in ['age', 'gender', 'weight_kg', 'activity_level', 'dietary_preference']:
            if field in validated_data:
                profile_fields[field] = validated_data.pop(field)

        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Update the auto-created profile with provided fields
        if profile_fields:
            profile = user.profile
            for key, value in profile_fields.items():
                setattr(profile, key, value)
            profile.save()

        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile and basic user info."""
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'email',
            'age', 'gender', 'weight_kg', 'activity_level', 'dietary_preference'
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update User fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update Profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

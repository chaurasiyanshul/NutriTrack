from rest_framework import serializers
from .models import FoodItem, FoodNutrient, Nutrient


class NutrientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrient
        fields = ['id', 'name', 'unit']


class FoodNutrientSerializer(serializers.ModelSerializer):
    nutrient_name = serializers.CharField(source='nutrient.name', read_only=True)
    nutrient_unit = serializers.CharField(source='nutrient.unit', read_only=True)

    class Meta:
        model = FoodNutrient
        fields = ['id', 'nutrient', 'nutrient_name', 'nutrient_unit', 'amount_per_100g']


class FoodItemListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for food list views."""
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'category', 'category_display', 'calories_per_100g',
                  'serving_unit', 'default_serving_g', 'is_vegetarian']


class FoodItemDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nutrient breakdown."""
    nutrients = FoodNutrientSerializer(many=True, read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'category', 'category_display', 'calories_per_100g',
                  'serving_unit', 'default_serving_g', 'is_vegetarian', 'nutrients']

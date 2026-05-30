from rest_framework import serializers
from .models import Meal, MealItem
from foods.serializers import FoodItemListSerializer


class MealItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food_item.name', read_only=True)
    food_category = serializers.CharField(source='food_item.category', read_only=True)
    calories = serializers.FloatField(read_only=True)
    calories_per_100g = serializers.FloatField(source='food_item.calories_per_100g', read_only=True)

    class Meta:
        model = MealItem
        fields = ['id', 'food_item', 'food_name', 'food_category',
                  'quantity_g', 'calories', 'calories_per_100g']


class MealSerializer(serializers.ModelSerializer):
    items = MealItemSerializer(many=True, read_only=True)
    total_calories = serializers.SerializerMethodField()
    meal_type_display = serializers.CharField(source='get_meal_type_display', read_only=True)

    class Meta:
        model = Meal
        fields = ['id', 'date', 'meal_type', 'meal_type_display',
                  'items', 'total_calories', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_total_calories(self, obj):
        return round(sum(item.calories for item in obj.items.all()), 1)


class MealCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a meal."""
    class Meta:
        model = Meal
        fields = ['date', 'meal_type']

    def create(self, validated_data):
        user = self.context['request'].user
        # Get or create meal for this user/date/type
        meal, created = Meal.objects.get_or_create(
            user=user,
            date=validated_data['date'],
            meal_type=validated_data['meal_type']
        )
        return meal


class AddMealItemSerializer(serializers.ModelSerializer):
    """Serializer for adding a food item to a meal."""
    class Meta:
        model = MealItem
        fields = ['food_item', 'quantity_g']

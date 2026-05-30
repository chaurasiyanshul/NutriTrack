from django.db import models
from django.contrib.auth.models import User
from foods.models import FoodItem


class Meal(models.Model):
    """A meal logged by a user (breakfast, lunch, dinner, snack)."""
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.meal_type} on {self.date}"

    class Meta:
        ordering = ['-date', 'meal_type']
        unique_together = ['user', 'date', 'meal_type']


class MealItem(models.Model):
    """A food item within a meal, with quantity."""
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name='meal_items')
    quantity_g = models.FloatField(help_text="Quantity in grams")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_item.name} - {self.quantity_g}g"

    @property
    def calories(self):
        """Calculate calories for this quantity."""
        return (self.food_item.calories_per_100g * self.quantity_g) / 100

    class Meta:
        ordering = ['created_at']

from django.db import models


class Nutrient(models.Model):
    """A nutrient type (e.g., Iron, Calcium, Vitamin C)."""
    name = models.CharField(max_length=100, unique=True)
    unit = models.CharField(max_length=20, help_text="e.g., mg, mcg, g, IU")

    def __str__(self):
        return f"{self.name} ({self.unit})"

    class Meta:
        ordering = ['name']


class FoodItem(models.Model):
    """A food item with basic info and calorie data."""
    CATEGORY_CHOICES = [
        ('grains', 'Grains & Cereals'),
        ('pulses', 'Pulses & Legumes'),
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('dairy', 'Dairy Products'),
        ('meat', 'Meat & Poultry'),
        ('fish', 'Fish & Seafood'),
        ('nuts', 'Nuts & Seeds'),
        ('oils', 'Oils & Fats'),
        ('beverages', 'Beverages'),
        ('sweets', 'Sweets & Snacks'),
        ('eggs', 'Eggs'),
        ('spices', 'Spices & Condiments'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    calories_per_100g = models.FloatField(help_text="Calories per 100 grams")
    serving_unit = models.CharField(max_length=50, default='g', help_text="e.g., g, ml, piece")
    default_serving_g = models.FloatField(default=100, help_text="Default serving size in grams")
    is_vegetarian = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class FoodNutrient(models.Model):
    """Nutrient content of a food item (per 100g)."""
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name='nutrients')
    nutrient = models.ForeignKey(Nutrient, on_delete=models.CASCADE, related_name='food_nutrients')
    amount_per_100g = models.FloatField(help_text="Amount of this nutrient per 100g of the food")

    def __str__(self):
        return f"{self.food_item.name} - {self.nutrient.name}: {self.amount_per_100g}{self.nutrient.unit}"

    class Meta:
        unique_together = ['food_item', 'nutrient']
        ordering = ['food_item', 'nutrient']

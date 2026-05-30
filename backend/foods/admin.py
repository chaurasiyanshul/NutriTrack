from django.contrib import admin
from .models import FoodItem, Nutrient, FoodNutrient

class FoodNutrientInline(admin.TabularInline):
    model = FoodNutrient
    extra = 1

@admin.register(Nutrient)
class NutrientAdmin(admin.ModelAdmin):
    list_display = ['name', 'unit']

@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'calories_per_100g', 'is_vegetarian']
    list_filter = ['category', 'is_vegetarian']
    search_fields = ['name']
    inlines = [FoodNutrientInline]

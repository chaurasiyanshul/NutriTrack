from django.contrib import admin
from .models import Meal, MealItem

class MealItemInline(admin.TabularInline):
    model = MealItem
    extra = 1

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'meal_type']
    list_filter = ['meal_type', 'date']
    search_fields = ['user__username']
    inlines = [MealItemInline]

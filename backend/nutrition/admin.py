from django.contrib import admin
from .models import RecommendedIntake, DailySummary

@admin.register(RecommendedIntake)
class RecommendedIntakeAdmin(admin.ModelAdmin):
    list_display = ['nutrient', 'gender', 'age_min', 'age_max', 'rda_amount']
    list_filter = ['gender', 'nutrient']

@admin.register(DailySummary)
class DailySummaryAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'total_calories']
    list_filter = ['date']
    search_fields = ['user__username']

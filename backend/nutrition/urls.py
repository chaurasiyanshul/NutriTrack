from django.urls import path
from .views import daily_summary, weekly_trends, monthly_trends, food_recommendations

urlpatterns = [
    path('daily/', daily_summary, name='daily-summary'),
    path('weekly/', weekly_trends, name='weekly-trends'),
    path('monthly/', monthly_trends, name='monthly-trends'),
    path('recommendations/', food_recommendations, name='food-recommendations'),
]

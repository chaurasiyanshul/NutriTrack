from django.urls import path
from .views import FoodItemListView, FoodItemDetailView, food_categories

urlpatterns = [
    path('', FoodItemListView.as_view(), name='food-list'),
    path('categories/', food_categories, name='food-categories'),
    path('<int:pk>/', FoodItemDetailView.as_view(), name='food-detail'),
]

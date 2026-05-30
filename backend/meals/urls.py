from django.urls import path
from .views import MealListCreateView, MealDetailView, MealItemAddView, MealItemDeleteView

urlpatterns = [
    path('', MealListCreateView.as_view(), name='meal-list-create'),
    path('<int:pk>/', MealDetailView.as_view(), name='meal-detail'),
    path('<int:meal_id>/items/', MealItemAddView.as_view(), name='meal-item-add'),
    path('<int:meal_id>/items/<int:item_id>/', MealItemDeleteView.as_view(), name='meal-item-delete'),
]

"""
NutriTrack URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/foods/', include('foods.urls')),
    path('api/meals/', include('meals.urls')),
    path('api/nutrition/', include('nutrition.urls')),
]

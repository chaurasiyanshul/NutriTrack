from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'gender', 'weight_kg', 'activity_level', 'dietary_preference']
    list_filter = ['gender', 'activity_level', 'dietary_preference']
    search_fields = ['user__username', 'user__email']

from rest_framework import serializers
from .models import RecommendedIntake, DailySummary


class RecommendedIntakeSerializer(serializers.ModelSerializer):
    nutrient_name = serializers.CharField(source='nutrient.name', read_only=True)
    nutrient_unit = serializers.CharField(source='nutrient.unit', read_only=True)

    class Meta:
        model = RecommendedIntake
        fields = ['id', 'nutrient', 'nutrient_name', 'nutrient_unit',
                  'gender', 'age_min', 'age_max', 'rda_amount']


class DailySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySummary
        fields = ['id', 'date', 'total_calories', 'nutrient_totals',
                  'deficiencies', 'updated_at']

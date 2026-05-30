from django.db import models
from django.contrib.auth.models import User
from foods.models import Nutrient


class RecommendedIntake(models.Model):
    """RDA (Recommended Dietary Allowance) by age range and gender."""
    nutrient = models.ForeignKey(Nutrient, on_delete=models.CASCADE, related_name='recommended_intakes')
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    age_min = models.PositiveIntegerField()
    age_max = models.PositiveIntegerField()
    rda_amount = models.FloatField(help_text="Recommended daily amount")

    def __str__(self):
        return f"{self.nutrient.name} - {self.gender} ({self.age_min}-{self.age_max}): {self.rda_amount}{self.nutrient.unit}"

    class Meta:
        ordering = ['nutrient', 'gender', 'age_min']


class DailySummary(models.Model):
    """Cached daily nutrient summary for a user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_summaries')
    date = models.DateField()
    total_calories = models.FloatField(default=0)
    nutrient_totals = models.JSONField(default=dict, help_text="Dict of nutrient_name: amount")
    deficiencies = models.JSONField(default=list, help_text="List of deficiency results")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.date}"

    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
        verbose_name_plural = 'Daily Summaries'

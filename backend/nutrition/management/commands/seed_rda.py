"""
Seed RDA (Recommended Dietary Allowance) data based on ICMR-NIN 2020 guidelines.
Usage: python manage.py seed_rda
"""
from django.core.management.base import BaseCommand
from foods.models import Nutrient
from nutrition.models import RecommendedIntake


# RDA data based on ICMR-NIN 2020 guidelines (simplified age groups)
# Format: (nutrient_name, gender, age_min, age_max, rda_amount)
RDA_DATA = [
    # Protein (g/day)
    ('Protein', 'male', 1, 3, 12.5),
    ('Protein', 'female', 1, 3, 12.5),
    ('Protein', 'male', 4, 6, 16.0),
    ('Protein', 'female', 4, 6, 16.0),
    ('Protein', 'male', 7, 9, 23.0),
    ('Protein', 'female', 7, 9, 23.0),
    ('Protein', 'male', 10, 12, 32.0),
    ('Protein', 'female', 10, 12, 33.0),
    ('Protein', 'male', 13, 15, 41.0),
    ('Protein', 'female', 13, 15, 40.0),
    ('Protein', 'male', 16, 17, 46.0),
    ('Protein', 'female', 16, 17, 43.0),
    ('Protein', 'male', 18, 30, 54.0),
    ('Protein', 'female', 18, 30, 46.0),
    ('Protein', 'male', 31, 50, 54.0),
    ('Protein', 'female', 31, 50, 46.0),
    ('Protein', 'male', 51, 70, 54.0),
    ('Protein', 'female', 51, 70, 46.0),
    ('Protein', 'male', 71, 100, 54.0),
    ('Protein', 'female', 71, 100, 46.0),

    # Iron (mg/day)
    ('Iron', 'male', 1, 3, 9.0),
    ('Iron', 'female', 1, 3, 9.0),
    ('Iron', 'male', 4, 6, 13.0),
    ('Iron', 'female', 4, 6, 13.0),
    ('Iron', 'male', 7, 9, 16.0),
    ('Iron', 'female', 7, 9, 16.0),
    ('Iron', 'male', 10, 12, 21.0),
    ('Iron', 'female', 10, 12, 27.0),
    ('Iron', 'male', 13, 15, 32.0),
    ('Iron', 'female', 13, 15, 27.0),
    ('Iron', 'male', 16, 17, 28.0),
    ('Iron', 'female', 16, 17, 26.0),
    ('Iron', 'male', 18, 30, 19.0),
    ('Iron', 'female', 18, 30, 29.0),
    ('Iron', 'male', 31, 50, 19.0),
    ('Iron', 'female', 31, 50, 29.0),
    ('Iron', 'male', 51, 100, 17.0),
    ('Iron', 'female', 51, 100, 21.0),

    # Calcium (mg/day)
    ('Calcium', 'male', 1, 3, 500.0),
    ('Calcium', 'female', 1, 3, 500.0),
    ('Calcium', 'male', 4, 6, 550.0),
    ('Calcium', 'female', 4, 6, 550.0),
    ('Calcium', 'male', 7, 9, 650.0),
    ('Calcium', 'female', 7, 9, 650.0),
    ('Calcium', 'male', 10, 17, 800.0),
    ('Calcium', 'female', 10, 17, 800.0),
    ('Calcium', 'male', 18, 50, 1000.0),
    ('Calcium', 'female', 18, 50, 1000.0),
    ('Calcium', 'male', 51, 100, 1200.0),
    ('Calcium', 'female', 51, 100, 1200.0),

    # Vitamin C (mg/day)
    ('Vitamin C', 'male', 1, 3, 30.0),
    ('Vitamin C', 'female', 1, 3, 30.0),
    ('Vitamin C', 'male', 4, 6, 30.0),
    ('Vitamin C', 'female', 4, 6, 30.0),
    ('Vitamin C', 'male', 7, 9, 35.0),
    ('Vitamin C', 'female', 7, 9, 35.0),
    ('Vitamin C', 'male', 10, 12, 40.0),
    ('Vitamin C', 'female', 10, 12, 40.0),
    ('Vitamin C', 'male', 13, 17, 50.0),
    ('Vitamin C', 'female', 13, 17, 50.0),
    ('Vitamin C', 'male', 18, 100, 80.0),
    ('Vitamin C', 'female', 18, 100, 65.0),

    # Vitamin A (mcg/day)
    ('Vitamin A', 'male', 1, 3, 300.0),
    ('Vitamin A', 'female', 1, 3, 300.0),
    ('Vitamin A', 'male', 4, 6, 300.0),
    ('Vitamin A', 'female', 4, 6, 300.0),
    ('Vitamin A', 'male', 7, 9, 400.0),
    ('Vitamin A', 'female', 7, 9, 400.0),
    ('Vitamin A', 'male', 10, 12, 500.0),
    ('Vitamin A', 'female', 10, 12, 500.0),
    ('Vitamin A', 'male', 13, 17, 600.0),
    ('Vitamin A', 'female', 13, 17, 600.0),
    ('Vitamin A', 'male', 18, 100, 1000.0),
    ('Vitamin A', 'female', 18, 100, 840.0),

    # Vitamin D (mcg/day)
    ('Vitamin D', 'male', 1, 17, 10.0),
    ('Vitamin D', 'female', 1, 17, 10.0),
    ('Vitamin D', 'male', 18, 50, 15.0),
    ('Vitamin D', 'female', 18, 50, 15.0),
    ('Vitamin D', 'male', 51, 100, 15.0),
    ('Vitamin D', 'female', 51, 100, 15.0),

    # Fiber (g/day)
    ('Fiber', 'male', 1, 3, 19.0),
    ('Fiber', 'female', 1, 3, 19.0),
    ('Fiber', 'male', 4, 9, 25.0),
    ('Fiber', 'female', 4, 9, 25.0),
    ('Fiber', 'male', 10, 17, 31.0),
    ('Fiber', 'female', 10, 17, 26.0),
    ('Fiber', 'male', 18, 50, 38.0),
    ('Fiber', 'female', 18, 50, 25.0),
    ('Fiber', 'male', 51, 100, 30.0),
    ('Fiber', 'female', 51, 100, 21.0),

    # Zinc (mg/day)
    ('Zinc', 'male', 1, 3, 3.0),
    ('Zinc', 'female', 1, 3, 3.0),
    ('Zinc', 'male', 4, 6, 5.0),
    ('Zinc', 'female', 4, 6, 5.0),
    ('Zinc', 'male', 7, 9, 7.0),
    ('Zinc', 'female', 7, 9, 7.0),
    ('Zinc', 'male', 10, 12, 9.0),
    ('Zinc', 'female', 10, 12, 8.0),
    ('Zinc', 'male', 13, 17, 12.0),
    ('Zinc', 'female', 13, 17, 10.0),
    ('Zinc', 'male', 18, 100, 14.0),
    ('Zinc', 'female', 18, 100, 10.0),

    # Folate (mcg/day)
    ('Folate', 'male', 1, 3, 80.0),
    ('Folate', 'female', 1, 3, 80.0),
    ('Folate', 'male', 4, 6, 100.0),
    ('Folate', 'female', 4, 6, 100.0),
    ('Folate', 'male', 7, 9, 120.0),
    ('Folate', 'female', 7, 9, 120.0),
    ('Folate', 'male', 10, 12, 150.0),
    ('Folate', 'female', 10, 12, 150.0),
    ('Folate', 'male', 13, 17, 200.0),
    ('Folate', 'female', 13, 17, 200.0),
    ('Folate', 'male', 18, 100, 300.0),
    ('Folate', 'female', 18, 100, 220.0),
]


class Command(BaseCommand):
    help = 'Seed recommended daily allowance (RDA) data'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for nutrient_name, gender, age_min, age_max, rda_amount in RDA_DATA:
            try:
                nutrient = Nutrient.objects.get(name=nutrient_name)
            except Nutrient.DoesNotExist:
                self.stderr.write(
                    self.style.WARNING(f'Nutrient "{nutrient_name}" not found. Run import_foods first.')
                )
                continue

            _, created = RecommendedIntake.objects.update_or_create(
                nutrient=nutrient,
                gender=gender,
                age_min=age_min,
                age_max=age_max,
                defaults={'rda_amount': rda_amount}
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'\nRDA seeding complete!'
            f'\n  Created: {created_count}'
            f'\n  Updated: {updated_count}'
        ))

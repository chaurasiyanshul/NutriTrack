"""
Django management command to import food data from CSV file.
Usage: python manage.py import_foods
"""
import csv
import os
from django.core.management.base import BaseCommand
from foods.models import FoodItem, Nutrient, FoodNutrient


# Mapping of CSV column names to nutrient names and units
NUTRIENT_MAP = {
    'protein_g': ('Protein', 'g'),
    'iron_mg': ('Iron', 'mg'),
    'calcium_mg': ('Calcium', 'mg'),
    'vitamin_c_mg': ('Vitamin C', 'mg'),
    'vitamin_a_mcg': ('Vitamin A', 'mcg'),
    'vitamin_d_mcg': ('Vitamin D', 'mcg'),
    'fiber_g': ('Fiber', 'g'),
    'zinc_mg': ('Zinc', 'mg'),
    'folate_mcg': ('Folate', 'mcg'),
}


class Command(BaseCommand):
    help = 'Import food items and nutrient data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'data', 'foods.csv'),
            help='Path to the CSV file'
        )

    def handle(self, *args, **options):
        csv_file = options['file']

        if not os.path.exists(csv_file):
            self.stderr.write(self.style.ERROR(f'CSV file not found: {csv_file}'))
            return

        # Create/get nutrient types
        nutrients = {}
        for csv_col, (nutrient_name, unit) in NUTRIENT_MAP.items():
            nutrient, created = Nutrient.objects.get_or_create(
                name=nutrient_name,
                defaults={'unit': unit}
            )
            nutrients[csv_col] = nutrient
            if created:
                self.stdout.write(f'  Created nutrient: {nutrient_name} ({unit})')

        # Read and import CSV
        foods_created = 0
        foods_updated = 0
        nutrients_created = 0

        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row in reader:
                food_item, created = FoodItem.objects.update_or_create(
                    name=row['name'].strip(),
                    defaults={
                        'category': row['category'].strip(),
                        'calories_per_100g': float(row['calories_per_100g']),
                        'default_serving_g': float(row['default_serving_g']),
                        'is_vegetarian': row['is_vegetarian'].strip() == 'True',
                    }
                )

                if created:
                    foods_created += 1
                else:
                    foods_updated += 1

                # Create/update nutrient values for this food
                for csv_col, nutrient in nutrients.items():
                    value = float(row.get(csv_col, 0) or 0)
                    _, nut_created = FoodNutrient.objects.update_or_create(
                        food_item=food_item,
                        nutrient=nutrient,
                        defaults={'amount_per_100g': value}
                    )
                    if nut_created:
                        nutrients_created += 1

        self.stdout.write(self.style.SUCCESS(
            f'\nImport complete!'
            f'\n  Foods created: {foods_created}'
            f'\n  Foods updated: {foods_updated}'
            f'\n  Nutrient records created: {nutrients_created}'
        ))

"""
Nutrient Calculation Engine — Core Business Logic

This module implements:
1. Daily nutrient aggregation from meals
2. Deficiency detection (rule-based)
3. Food recommendations for deficient nutrients
"""

from meals.models import Meal
from foods.models import FoodNutrient
from .models import RecommendedIntake, DailySummary


def calculate_daily_nutrients(user, date):
    """
    Sum all nutrients from meals logged on a given date.

    Returns dict: {nutrient_name: {'amount': float, 'unit': str}}
    """
    meals = Meal.objects.filter(user=user, date=date).prefetch_related(
        'items__food_item__nutrients__nutrient'
    )

    totals = {}
    total_calories = 0

    for meal in meals:
        for item in meal.items.all():
            # Add calories
            item_calories = (item.food_item.calories_per_100g * item.quantity_g) / 100
            total_calories += item_calories

            # Add each nutrient
            for food_nutrient in item.food_item.nutrients.all():
                nutrient_name = food_nutrient.nutrient.name
                nutrient_unit = food_nutrient.nutrient.unit
                amount = (food_nutrient.amount_per_100g * item.quantity_g) / 100

                if nutrient_name not in totals:
                    totals[nutrient_name] = {'amount': 0, 'unit': nutrient_unit}
                totals[nutrient_name]['amount'] += amount

    # Round all values
    for key in totals:
        totals[key]['amount'] = round(totals[key]['amount'], 2)

    return {
        'total_calories': round(total_calories, 1),
        'nutrients': totals
    }


def detect_deficiencies(user, nutrient_totals):
    """
    Compare intake vs RDA and classify each nutrient.

    Thresholds:
    - < 70% of RDA → Deficient
    - 70-120% of RDA → Normal
    - > 120% of RDA → Excess

    Returns list of dicts with status for each tracked nutrient.
    """
    profile = user.profile
    age = profile.age or 25  # Default age if not set
    gender = profile.gender if profile.gender in ('male', 'female') else 'male'

    # Get all RDA values for this user's demographic
    rdas = RecommendedIntake.objects.filter(
        gender=gender,
        age_min__lte=age,
        age_max__gte=age
    ).select_related('nutrient')

    results = []
    nutrients_data = nutrient_totals.get('nutrients', {})

    for rda in rdas:
        nutrient_name = rda.nutrient.name
        intake_data = nutrients_data.get(nutrient_name, {'amount': 0, 'unit': rda.nutrient.unit})
        intake = intake_data['amount']

        if rda.rda_amount > 0:
            percentage = (intake / rda.rda_amount) * 100
        else:
            percentage = 100

        # Classify status
        if percentage < 70:
            status_val = 'deficient'
            message = f'Low {nutrient_name} Intake'
        elif percentage > 120:
            status_val = 'excess'
            message = f'{nutrient_name} Intake is High'
        else:
            status_val = 'normal'
            message = f'{nutrient_name} Intake is Normal'

        results.append({
            'nutrient': nutrient_name,
            'intake': round(intake, 2),
            'rda': rda.rda_amount,
            'percentage': round(percentage, 1),
            'status': status_val,
            'unit': rda.nutrient.unit,
            'message': message
        })

    # Sort: deficient first, then excess, then normal
    status_order = {'deficient': 0, 'excess': 1, 'normal': 2}
    results.sort(key=lambda x: status_order.get(x['status'], 3))

    return results


def get_food_recommendations(deficiencies, dietary_preference='vegetarian'):
    """
    Suggest foods rich in deficient nutrients.

    For each deficient nutrient, returns top 5 foods richest in that nutrient,
    filtered by dietary preference if applicable.
    """
    recommendations = {}

    for d in deficiencies:
        if d['status'] == 'deficient':
            nutrient_name = d['nutrient']

            # Get top foods rich in this nutrient
            queryset = FoodNutrient.objects.filter(
                nutrient__name=nutrient_name,
                amount_per_100g__gt=0
            ).select_related('food_item')

            # Filter by dietary preference
            if dietary_preference in ('vegetarian', 'vegan'):
                queryset = queryset.filter(food_item__is_vegetarian=True)

            top_foods = queryset.order_by('-amount_per_100g')[:5]

            if top_foods:
                recommendations[nutrient_name] = {
                    'current_intake': d['intake'],
                    'rda': d['rda'],
                    'percentage': d['percentage'],
                    'unit': d['unit'],
                    'suggested_foods': [
                        {
                            'food_id': fn.food_item.id,
                            'food_name': fn.food_item.name,
                            'amount_per_100g': fn.amount_per_100g,
                            'calories_per_100g': fn.food_item.calories_per_100g,
                            'category': fn.food_item.get_category_display(),
                        }
                        for fn in top_foods
                    ]
                }

    return recommendations


def generate_daily_summary(user, date):
    """
    Generate and cache a complete daily summary.
    Combines nutrient calculation, deficiency detection, and caches the result.
    """
    nutrient_totals = calculate_daily_nutrients(user, date)
    deficiencies = detect_deficiencies(user, nutrient_totals)

    # Cache in DailySummary
    summary, _ = DailySummary.objects.update_or_create(
        user=user,
        date=date,
        defaults={
            'total_calories': nutrient_totals['total_calories'],
            'nutrient_totals': nutrient_totals['nutrients'],
            'deficiencies': deficiencies,
        }
    )

    return {
        'date': str(date),
        'total_calories': nutrient_totals['total_calories'],
        'nutrients': nutrient_totals['nutrients'],
        'deficiencies': deficiencies,
    }

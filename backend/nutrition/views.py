from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import date, timedelta
from .services import generate_daily_summary, get_food_recommendations, detect_deficiencies, calculate_daily_nutrients


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def daily_summary(request):
    """Get daily nutrient summary with deficiency detection."""
    target_date = request.query_params.get('date', str(date.today()))
    try:
        from datetime import datetime
        target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

    summary = generate_daily_summary(request.user, target_date)
    return Response(summary)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def weekly_trends(request):
    """Get nutrient trends for the past 7 days."""
    today = date.today()
    trends = []

    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        summary = generate_daily_summary(request.user, day)
        trends.append(summary)

    return Response(trends)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def monthly_trends(request):
    """Get nutrient trends for the past 30 days."""
    today = date.today()
    trends = []

    for i in range(29, -1, -1):
        day = today - timedelta(days=i)
        summary = generate_daily_summary(request.user, day)
        trends.append(summary)

    return Response(trends)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def food_recommendations(request):
    """Get food recommendations based on today's deficiencies."""
    target_date = request.query_params.get('date', str(date.today()))
    try:
        from datetime import datetime
        target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

    nutrient_totals = calculate_daily_nutrients(request.user, target_date)
    deficiencies = detect_deficiencies(request.user, nutrient_totals)

    dietary_pref = 'vegetarian'
    if hasattr(request.user, 'profile'):
        dietary_pref = request.user.profile.dietary_preference

    recommendations = get_food_recommendations(deficiencies, dietary_pref)
    return Response(recommendations)

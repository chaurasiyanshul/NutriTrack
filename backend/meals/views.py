from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Meal, MealItem
from .serializers import (
    MealSerializer, MealCreateSerializer, AddMealItemSerializer
)


class MealListCreateView(APIView):
    """List meals for a date or create a new meal."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date = request.query_params.get('date')
        meals = Meal.objects.filter(user=request.user)
        if date:
            meals = meals.filter(date=date)
        meals = meals.prefetch_related('items__food_item')
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MealCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        meal = serializer.save()
        return Response(
            MealSerializer(meal).data,
            status=status.HTTP_201_CREATED
        )


class MealDetailView(APIView):
    """Get, update, or delete a specific meal."""
    permission_classes = [permissions.IsAuthenticated]

    def get_meal(self, pk, user):
        return get_object_or_404(Meal, pk=pk, user=user)

    def get(self, request, pk):
        meal = self.get_meal(pk, request.user)
        return Response(MealSerializer(meal).data)

    def delete(self, request, pk):
        meal = self.get_meal(pk, request.user)
        meal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MealItemAddView(APIView):
    """Add a food item to a meal."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, meal_id):
        meal = get_object_or_404(Meal, pk=meal_id, user=request.user)
        serializer = AddMealItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(meal=meal)
        return Response(
            MealSerializer(meal).data,
            status=status.HTTP_201_CREATED
        )


class MealItemDeleteView(APIView):
    """Remove a food item from a meal."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, meal_id, item_id):
        meal = get_object_or_404(Meal, pk=meal_id, user=request.user)
        item = get_object_or_404(MealItem, pk=item_id, meal=meal)
        item.delete()
        return Response(
            MealSerializer(meal).data,
            status=status.HTTP_200_OK
        )

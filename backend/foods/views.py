from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import FoodItem
from .serializers import FoodItemListSerializer, FoodItemDetailSerializer


class FoodItemListView(generics.ListAPIView):
    """List all food items with search and category filter."""
    serializer_class = FoodItemListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'calories_per_100g']

    def get_queryset(self):
        queryset = FoodItem.objects.all()
        category = self.request.query_params.get('category', None)
        vegetarian = self.request.query_params.get('vegetarian', None)

        if category:
            queryset = queryset.filter(category=category)
        if vegetarian is not None:
            queryset = queryset.filter(is_vegetarian=vegetarian.lower() == 'true')

        return queryset


class FoodItemDetailView(generics.RetrieveAPIView):
    """Get a food item with full nutrient breakdown."""
    queryset = FoodItem.objects.prefetch_related('nutrients__nutrient').all()
    serializer_class = FoodItemDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def food_categories(request):
    """List all available food categories."""
    categories = [
        {'value': choice[0], 'label': choice[1]}
        for choice in FoodItem.CATEGORY_CHOICES
    ]
    return Response(categories)

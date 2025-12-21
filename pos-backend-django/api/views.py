from django.http import JsonResponse
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, filters, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import (
    UserSerializer, CategorySerializer, ProductSerializer,
    TableSerializer, OrderSerializer, CustomTokenObtainPairSerializer,
    UserUpdateSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Category, Product, Table, Order, Customer

def api_root(request):
    return JsonResponse({"message": "Welcome to the POS API"})

from .serializers import (
    UserSerializer, CategorySerializer, ProductSerializer,
    TableSerializer, OrderSerializer, CustomTokenObtainPairSerializer,
    UserUpdateSerializer, CustomerSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Allowing any user to register for now, usually would be admin only or open
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return JsonResponse({
            'message': 'User registered successfully',
            'token': str(refresh.access_token),
            'data': {
                'user': UserSerializer(user).data
            }
        }, status=201)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category__name']

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        # Optional: Filter by section if needed
        return super().get_queryset()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status', None)
        if status_param is not None:
            queryset = queryset.filter(status=status_param)
        return queryset

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            return Response({'status': 'success', 'data': {'order': OrderSerializer(order).data}})
        return Response({'status': 'error', 'message': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        today = timezone.now().date()
        orders = Order.objects.all()
        
        # 1. Total Revenue
        total_revenue = orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # 2. Total Orders
        total_orders = orders.count()
        
        # 3. Today's Revenue
        today_revenue = orders.filter(created_at__date=today).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # 4. Today's Orders
        today_orders = orders.filter(created_at__date=today).count()
        
        # 6. Recent Sales (Last 5 orders)
        recent_orders = orders.order_by('-created_at')[:5]
        recent_sales_data = OrderSerializer(recent_orders, many=True).data
        
        data = {
            'totalRevenue': total_revenue,
            'totalOrders': total_orders,
            'todayRevenue': today_revenue,
            'todayOrders': today_orders,
            'recentSales': recent_sales_data,
            'revenueData': [
                {'name': 'Mon', 'value': 4000},
                {'name': 'Tue', 'value': 3000},
                {'name': 'Wed', 'value': 2000},
                {'name': 'Thu', 'value': 2780},
                {'name': 'Fri', 'value': 1890},
                {'name': 'Sat', 'value': 2390},
                {'name': 'Sun', 'value': 3490},
            ],
            'topProducts': [
                {'name': 'Burger', 'value': 400},
                {'name': 'Pizza', 'value': 300},
                {'name': 'Pasta', 'value': 300},
                {'name': 'Salad', 'value': 200},
            ]
        }
        return Response({'status': 'success', 'data': data})

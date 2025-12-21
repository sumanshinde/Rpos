from rest_framework import serializers
from .models import Category, Product, Table, Order, OrderItem, Customer
from django.contrib.auth.models import User
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra user data to the response
        user_data = UserSerializer(self.user).data
        data['data'] = {
            'user': user_data
        }
        # Rename access to token to match frontend expectation if needed, 
        # or just keep 'access' and 'refresh'. 
        # Frontend authSlice says: localStorage.setItem('token', data.token);
        # So it expects 'token' key.
        data['token'] = data['access']
        
        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_data = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {
            'order_number': {'read_only': True},
            'subtotal': {'read_only': True},
            'total_amount': {'read_only': True}
        }

    def create(self, validated_data):
        items_data = validated_data.pop('items_data')
        
        # Calculate totals
        subtotal = sum(Decimal(str(item.get('price'))) * item.get('quantity') for item in items_data)
        discount = validated_data.get('discount', Decimal('0'))
        total_amount = subtotal - discount

        # Generate order number (basic implementation)
        import uuid
        order_number = f"ORD-{uuid.uuid4().hex[:6].upper()}"

        order = Order.objects.create(
            order_number=order_number,
            subtotal=subtotal,
            total_amount=total_amount,
            **validated_data
        )

        for item_data in items_data:
            # Handle product lookup if productId provided
            product_id = item_data.get('productId')
            product = None
            if product_id:
                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    pass
            
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=item_data.get('name'),
                price=item_data.get('price'),
                quantity=item_data.get('quantity'),
                notes=item_data.get('notes', '')
            )
        
        return order

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

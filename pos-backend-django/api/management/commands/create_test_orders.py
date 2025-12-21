from django.core.management.base import BaseCommand
from api.models import Order, OrderItem, Product, Table
from decimal import Decimal

class Command(BaseCommand):
    help = 'Create test orders for Kitchen Display System'

    def handle(self, *args, **options):
        self.stdout.write('Creating test orders...')

        # Get products and tables
        products = list(Product.objects.all()[:3])
        tables = list(Table.objects.all()[:2])

        if len(products) < 3:
            self.stdout.write(self.style.ERROR('Not enough products. Run seed_data first.'))
            return

        # Create Order 1 - Pending
        order1 = Order.objects.create(
            order_number=f'ORD-TEST001',
            order_type='dine-in',
            payment_method='cash',
            status='pending',
            table_number=tables[0].table_number if tables else None,
            waiter_name='John',
            subtotal=Decimal('25.00'),
            discount=Decimal('0.00'),
            total_amount=Decimal('27.50')
        )
        OrderItem.objects.create(
            order=order1,
            product=products[0],
            product_name=products[0].name,
            quantity=2,
            price=products[0].price
        )

        # Create Order 2 - Preparing
        order2 = Order.objects.create(
            order_number=f'ORD-TEST002',
            order_type='dine-in',
            payment_method='card',
            status='preparing',
            table_number=tables[1].table_number if len(tables) > 1 else None,
            waiter_name='Sarah',
            subtotal=Decimal('35.00'),
            discount=Decimal('5.00'),
            total_amount=Decimal('30.00')
        )
        OrderItem.objects.create(
            order=order2,
            product=products[1],
            product_name=products[1].name,
            quantity=1,
            price=products[1].price
        )
        OrderItem.objects.create(
            order=order2,
            product=products[2],
            product_name=products[2].name,
            quantity=2,
            price=products[2].price
        )

        # Create Order 3 - Takeaway 
        order3 = Order.objects.create(
            order_number=f'ORD-TEST003',
            order_type='takeaway',
            payment_method='cash',
            status='pending',
            waiter_name='Mike',
            subtotal=Decimal('15.00'),
            discount=Decimal('0.00'),
            total_amount=Decimal('15.00')
        )
        OrderItem.objects.create(
            order=order3,
            product=products[2],
            product_name=products[2].name,
            quantity=3,
            price=products[2].price
        )

        self.stdout.write(self.style.SUCCESS(f'Successfully created 3 test orders'))
        self.stdout.write(f'Order 1: {order1.order_number} - {order1.status}')
        self.stdout.write(f'Order 2: {order2.order_number} - {order2.status}')
        self.stdout.write(f'Order 3: {order3.order_number} - {order3.status}')

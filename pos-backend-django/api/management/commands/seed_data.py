from django.core.management.base import BaseCommand
from api.models import Category, Product

class Command(BaseCommand):
    help = 'Seed database with sample categories and products'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Clear existing data
        Product.objects.all().delete()
        Category.objects.all().delete()

        # Create Categories
        burger_cat = Category.objects.create(
            name='Burgers',
            slug='burgers',
            image='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'
        )

        pizza_cat = Category.objects.create(
            name='Pizza',
            slug='pizza',
            image='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'
        )

        beverage_cat = Category.objects.create(
            name='Beverages',
            slug='beverages',
            image='https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200'
        )

        # Create Products
        products = [
            # Burgers
            {
                'name': 'Classic Burger',
                'price': 8.99,
                'category': burger_cat,
                'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                'description': 'Juicy beef patty with lettuce, tomato, and special sauce',
                'is_available': True
            },
            {
                'name': 'Cheese Burger',
                'price': 9.99,
                'category': burger_cat,
                'image': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
                'description': 'Classic burger with melted cheddar cheese',
                'is_available': True
            },
            # Pizza
            {
                'name': 'Margherita Pizza',
                'price': 12.99,
                'category': pizza_cat,
                'image': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
                'description': 'Fresh tomatoes, mozzarella, and basil',
                'is_available': True
            },
            {
                'name': 'Pepperoni Pizza',
                'price': 14.99,
                'category': pizza_cat,
                'image': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
                'description': 'Classic pepperoni with cheese',
                'is_available': True
            },
            # Beverages
            {
                'name': 'Coca Cola',
                'price': 2.99,
                'category': beverage_cat,
                'image': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
                'description': 'Chilled Coca Cola',
                'is_available': True
            },
            {
                'name': 'Orange Juice',
                'price': 3.99,
                'category': beverage_cat,
                'image': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
                'description': 'Fresh orange juice',
                'is_available': True
            },
        ]

        for product_data in products:
            Product.objects.create(**product_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(products)} products'))

from django.core.management.base import BaseCommand
from api.models import Table

class Command(BaseCommand):
    help = 'Seed database with sample tables'

    def handle(self, *args, **options):
        self.stdout.write('Seeding tables...')

        # Clear existing tables
        Table.objects.all().delete()

        # Create Tables
        tables_data = [
            {'table_number': '1', 'capacity': 2, 'section': 'Main Hall', 'status': 'available'},
            {'table_number': '2', 'capacity': 4, 'section': 'Main Hall', 'status': 'available'},
            {'table_number': '3', 'capacity': 4, 'section': 'Main Hall', 'status': 'available'},
            {'table_number': '4', 'capacity': 6, 'section': 'Main Hall', 'status': 'available'},
            {'table_number': '5', 'capacity': 2, 'section': 'Patio', 'status': 'available'},
            {'table_number': '6', 'capacity': 4, 'section': 'Patio', 'status': 'available'},
            {'table_number': '7', 'capacity': 8, 'section': 'VIP', 'status': 'available'},
            {'table_number': '8', 'capacity': 4, 'section': 'VIP', 'status': 'available'},
        ]

        for table_data in tables_data:
            Table.objects.create(**table_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(tables_data)} tables'))

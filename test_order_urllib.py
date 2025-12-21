
import urllib.request
import json
import sys

url = "http://localhost:8000/api/orders/"
data = {
    "items_data": [{"productId": 1, "name": "Burger", "price": 10.0, "quantity": 1}],
    "payment_method": "cash",
    "order_type": "dine-in",
    "discount": 0
}
headers = {'Content-Type': 'application/json'}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers)
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Exception: {e}")

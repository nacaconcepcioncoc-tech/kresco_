from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Product

def dashboard(request):
    return render(request, 'dashboard.html')

def about(request):
    return render(request, 'about.html')

def bestsellers(request):
    # This fixes the "AttributeError: no attribute bestsellers"
    return render(request, 'bestsellers.html')

def shop(request):
    return render(request, 'shop.html')

def contact(request):
    return render(request, 'contact.html')  # or your contact template

def cart(request):
    return render(request, 'cart.html')

def reviews(request):
    return render(request, 'reviews.html')

@require_http_methods(["GET"])
def api_products(request):
    """API endpoint to fetch all products as JSON"""
    products = Product.objects.all().values(
        'id', 'name', 'price', 'image', 'flowers', 'fillers', 'available_colors', 'quantity_options'
    )
    return JsonResponse(list(products), safe=False)
from django.shortcuts import render
from django.http import HttpResponse

def dashboard(request):
    return render(request, 'dashboard.html')

def about(request):
    return render(request, 'about.html')

def blooms(request):
    # This fixes the "AttributeError: no attribute blooms"
    return render(request, 'blooms.html')

def shop(request):
    return render(request, 'shop.html')

def contact(request):
    return render(request, 'contact.html')  # or your contact template

def cart(request):
    return render(request, 'cart.html')

def chatbox(request):
    return render(request, 'chatbox.html')

def reviews(request):
    return render(request, 'reviews.html')
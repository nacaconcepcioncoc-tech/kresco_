from django.urls import path
from . import views

urlpatterns = [
    # This fixes the 404 error when visiting the main IP address
    path('', views.dashboard, name='dashboard'), 
    
    path('dashboard/', views.dashboard, name='dashboard'),
    path('about/', views.about, name='about'),
    
    # These lines MUST exist to stop the NoReverseMatch error
    path('shop/', views.shop, name='shop'),
    path('bestsellers/', views.bestsellers, name='bestsellers'),
    path('contact/', views.contact, name='contact'),
    path('cart/', views.cart, name='cart'),
    path('reviews/', views.reviews, name='reviews'),
]
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'flowers', 'fillers')
    list_editable = ('name', 'price', 'flowers', 'fillers')
    search_fields = ('name', 'flowers', 'fillers')
    ordering = ('id',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'price', 'image')
        }),
        ('Composition', {
            'fields': ('flowers', 'fillers')
        }),
        ('Customization', {
            'fields': ('available_colors', 'quantity_options'),
            'description': 'Colors should be entered as a JSON array: ["Red", "White", "Pink"]. Quantities as: [1, 2, 4, 6, 8, 10]'
        }),
    )

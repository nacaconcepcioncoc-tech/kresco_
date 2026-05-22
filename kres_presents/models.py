from django.db import models

class Product(models.Model):
    """Product model for KRES Co. flower shop"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=500, help_text="Path to image file, e.g., images/product1.jpg")
    flowers = models.TextField(help_text="Description of flowers included in the bouquet")
    fillers = models.TextField(blank=True, null=True, help_text="Description of fillers included")
    available_colors = models.JSONField(
        default=list,
        help_text="List of available colors as JSON array: ['Red', 'White', 'Pink', etc.]"
    )
    quantity_options = models.JSONField(
        default=lambda: [1, 2, 4, 6, 8, 10],
        help_text="Available quantity options (in dozens)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']
        verbose_name_plural = "Products"

    def __str__(self):
        return f"{self.name} - ₱{self.price}"

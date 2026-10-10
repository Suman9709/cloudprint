from django.conf import settings
from django.db import models


class Shop(models.Model):
    """A print shop created and managed by a platform administrator."""

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="shops",
    )
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    black_white_price_per_page = models.DecimalField(max_digits=8, decimal_places=2, default="2.00")
    colour_price_per_page = models.DecimalField(max_digits=8, decimal_places=2, default="5.00")
    spiral_bind_cost = models.DecimalField(max_digits=8, decimal_places=2, default="20.00")
    # Kept for existing records. New order estimates use the three prices above.
    price_per_page = models.DecimalField(max_digits=8, decimal_places=2, default="2.00")
    is_accepting_orders = models.BooleanField(default=True)
    # Deleted shops are retired so paid-order history remains auditable.
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

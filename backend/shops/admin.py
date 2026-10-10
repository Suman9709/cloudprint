from django.contrib import admin

from .models import Shop


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "owner", "black_white_price_per_page", "colour_price_per_page", "is_accepting_orders", "created_at")
    list_filter = ("is_accepting_orders",)
    search_fields = ("name", "slug", "owner__email")
    prepopulated_fields = {"slug": ("name",)}

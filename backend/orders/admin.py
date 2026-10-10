from django.contrib import admin

from .models import Order, OrderDocument


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("pickup_code", "shop", "original_filename", "status", "created_at")
    list_filter = ("status", "shop")
    search_fields = ("pickup_code", "original_filename", "customer_name")
    readonly_fields = ("pickup_code", "created_at", "updated_at")


@admin.register(OrderDocument)
class OrderDocumentAdmin(admin.ModelAdmin):
    list_display = ("original_filename", "order", "page_count", "page_count_status", "page_count_method")
    list_filter = ("page_count_status",)
    search_fields = ("original_filename", "order__pickup_code")

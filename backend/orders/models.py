import os
import uuid

from django.db import models


def order_document_path(instance, filename):
    extension = os.path.splitext(filename)[1].lower()
    # OrderDocument gets its shop through its parent order. The legacy Order
    # file field still has shop_id directly.
    shop_id = instance.shop_id if hasattr(instance, "shop_id") else instance.order.shop_id
    return f"shop_orders/{shop_id}/{uuid.uuid4().hex}{extension}"


class Order(models.Model):
    class PageCountStatus(models.TextChoices):
        EXACT = "exact", "Counted exactly"
        ESTIMATED = "estimated", "Estimated — confirm before printing"
        REVIEW_REQUIRED = "review_required", "Manual page review required"

    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Submitted"
        ACCEPTED = "accepted", "Accepted"
        PRINTING = "printing", "Printing"
        READY = "ready", "Ready for pickup"
        COLLECTED = "collected", "Collected"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Payment pending"
        MARKED_PAID = "marked_paid", "Marked paid"

    shop = models.ForeignKey("shops.Shop", on_delete=models.PROTECT, related_name="orders")
    pickup_code = models.CharField(max_length=4, unique=True, db_index=True)
    payment_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    # Kept for existing orders. New multi-file uploads live in ``documents``.
    document = models.FileField(upload_to=order_document_path, blank=True)
    original_filename = models.CharField(max_length=255)
    customer_name = models.CharField(max_length=100, blank=True)
    print_mode = models.CharField(max_length=20, default="black_white")
    sides = models.CharField(max_length=20, default="single")
    copies = models.PositiveSmallIntegerField(default=1)
    page_count = models.PositiveIntegerField(default=1)
    page_count_status = models.CharField(
        max_length=20,
        choices=PageCountStatus.choices,
        default=PageCountStatus.EXACT,
    )
    finishing = models.CharField(max_length=30, default="none")
    price_per_page = models.DecimalField(max_digits=8, decimal_places=2, default="2.00")
    finishing_cost = models.DecimalField(max_digits=8, decimal_places=2, default="0.00")
    # These are snapshots made when the customer submits an order. They must
    # never be recalculated from a shop's later price changes: reporting and
    # payment settlement need an immutable record of the agreed split.
    print_amount = models.DecimalField(max_digits=10, decimal_places=2, default="2.00")
    convenience_fee = models.DecimalField(max_digits=10, decimal_places=2, default="0.00")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default="2.00")
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )
    payment_marked_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.shop.name} · {self.pickup_code} · {self.original_filename}"


class OrderDocument(models.Model):
    """One uploaded file belonging to a print order."""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="documents")
    document = models.FileField(upload_to=order_document_path)
    original_filename = models.CharField(max_length=255)
    page_count = models.PositiveIntegerField(default=1)
    page_count_status = models.CharField(
        max_length=20,
        choices=Order.PageCountStatus.choices,
        default=Order.PageCountStatus.EXACT,
    )
    page_count_method = models.CharField(max_length=60, default="unknown")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.order.pickup_code} · {self.original_filename}"

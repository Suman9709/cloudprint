import uuid

from django.db import migrations, models


def issue_existing_payment_tokens(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    for order in Order.objects.filter(payment_token__isnull=True).iterator():
        order.payment_token = uuid.uuid4()
        order.save(update_fields=["payment_token"])


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="page_count",
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_marked_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_status",
            field=models.CharField(
                choices=[("pending", "Payment pending"), ("marked_paid", "Marked paid")],
                default="pending",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_token",
            field=models.UUIDField(blank=True, editable=False, null=True),
        ),
        migrations.RunPython(issue_existing_payment_tokens, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="order",
            name="payment_token",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AddField(
            model_name="order",
            name="price_per_page",
            field=models.DecimalField(decimal_places=2, default="2.00", max_digits=8),
        ),
        migrations.AddField(
            model_name="order",
            name="total_amount",
            field=models.DecimalField(decimal_places=2, default="2.00", max_digits=10),
        ),
    ]

import django.db.models.deletion
from django.db import migrations, models
import orders.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("shops", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("pickup_code", models.CharField(db_index=True, max_length=4, unique=True)),
                ("document", models.FileField(upload_to=orders.models.order_document_path)),
                ("original_filename", models.CharField(max_length=255)),
                ("customer_name", models.CharField(blank=True, max_length=100)),
                ("print_mode", models.CharField(default="black_white", max_length=20)),
                ("sides", models.CharField(default="single", max_length=20)),
                ("copies", models.PositiveSmallIntegerField(default=1)),
                ("finishing", models.CharField(default="none", max_length=30)),
                ("status", models.CharField(choices=[("submitted", "Submitted"), ("accepted", "Accepted"), ("printing", "Printing"), ("ready", "Ready for pickup"), ("collected", "Collected"), ("cancelled", "Cancelled")], default="submitted", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("shop", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="orders", to="shops.shop")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]

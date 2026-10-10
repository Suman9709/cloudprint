# Legacy single-file orders stay intact; new files are stored in OrderDocument.

from django.db import migrations, models
import django.db.models.deletion
import orders.models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0003_order_finishing_cost"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="document",
            field=models.FileField(blank=True, upload_to=orders.models.order_document_path),
        ),
        migrations.AddField(
            model_name="order",
            name="page_count_status",
            field=models.CharField(
                choices=[
                    ("exact", "Counted exactly"),
                    ("estimated", "Estimated — confirm before printing"),
                    ("review_required", "Manual page review required"),
                ],
                default="exact",
                max_length=20,
            ),
        ),
        migrations.CreateModel(
            name="OrderDocument",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("document", models.FileField(upload_to=orders.models.order_document_path)),
                ("original_filename", models.CharField(max_length=255)),
                ("page_count", models.PositiveIntegerField(default=1)),
                ("page_count_status", models.CharField(choices=[("exact", "Counted exactly"), ("estimated", "Estimated — confirm before printing"), ("review_required", "Manual page review required")], default="exact", max_length=20)),
                ("page_count_method", models.CharField(default="unknown", max_length=60)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="documents", to="orders.order")),
            ],
            options={"ordering": ["id"]},
        ),
    ]

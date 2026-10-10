from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0002_order_payment_and_pricing"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="finishing_cost",
            field=models.DecimalField(decimal_places=2, default="0.00", max_digits=8),
        ),
    ]

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shops", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="shop",
            name="price_per_page",
            field=models.DecimalField(decimal_places=2, default="2.00", max_digits=8),
        ),
    ]

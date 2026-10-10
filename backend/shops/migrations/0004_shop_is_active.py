from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shops", "0003_shop_profile_and_service_prices"),
    ]

    operations = [
        migrations.AddField(
            model_name="shop",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]

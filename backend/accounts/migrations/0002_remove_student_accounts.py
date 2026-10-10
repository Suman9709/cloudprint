from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[("shop", "Shop"), ("platform_admin", "Platform Admin")],
                default="shop",
                max_length=20,
            ),
        ),
    ]

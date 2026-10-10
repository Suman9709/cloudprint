from django.db import migrations, models


def copy_legacy_price_to_new_prices(apps, schema_editor):
    Shop = apps.get_model("shops", "Shop")
    for shop in Shop.objects.iterator():
        shop.black_white_price_per_page = shop.price_per_page
        shop.colour_price_per_page = shop.price_per_page
        shop.save(update_fields=["black_white_price_per_page", "colour_price_per_page"])


class Migration(migrations.Migration):
    dependencies = [
        ("shops", "0002_shop_price_per_page"),
    ]

    operations = [
        migrations.AddField(model_name="shop", name="black_white_price_per_page", field=models.DecimalField(decimal_places=2, default="2.00", max_digits=8)),
        migrations.AddField(model_name="shop", name="colour_price_per_page", field=models.DecimalField(decimal_places=2, default="5.00", max_digits=8)),
        migrations.AddField(model_name="shop", name="phone", field=models.CharField(blank=True, max_length=30)),
        migrations.AddField(model_name="shop", name="spiral_bind_cost", field=models.DecimalField(decimal_places=2, default="20.00", max_digits=8)),
        migrations.RunPython(copy_legacy_price_to_new_prices, migrations.RunPython.noop),
    ]

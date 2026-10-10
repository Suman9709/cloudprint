from django.db import migrations, models


def copy_existing_print_amounts(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    for order in Order.objects.all().only("id", "total_amount"):
        order.print_amount = order.total_amount
        order.save(update_fields=["print_amount"])


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0004_orderdocument_and_page_count_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="convenience_fee",
            field=models.DecimalField(decimal_places=2, default="0.00", max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="print_amount",
            field=models.DecimalField(decimal_places=2, default="2.00", max_digits=10),
        ),
        migrations.RunPython(copy_existing_print_amounts, migrations.RunPython.noop),
    ]

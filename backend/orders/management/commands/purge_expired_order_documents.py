from django.core.management.base import BaseCommand

from orders.retention import purge_expired_order_documents


class Command(BaseCommand):
    help = "Permanently delete expired uploaded documents while retaining order metadata."

    def handle(self, *args, **options):
        result = purge_expired_order_documents()
        self.stdout.write(
            self.style.SUCCESS(
                "Removed %(documents)s order documents and %(legacy_documents)s legacy documents."
                % result
            )
        )

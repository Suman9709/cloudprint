"""Short-lived storage for customer-uploaded documents."""

import logging
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from .models import Order, OrderDocument


logger = logging.getLogger(__name__)


def _remove_file(file_field):
    """Remove a stored file and clear its FileField without deleting metadata."""
    if not file_field:
        return False

    try:
        file_field.delete(save=False)
    except Exception:
        logger.exception("Could not remove expired customer document %s", file_field.name)
        return False
    return True


def purge_expired_order_documents(*, now=None):
    """Delete uploads older than the configured retention period.

    Orders and their document metadata are deliberately retained. Only the
    storage object and its FileField path are removed.
    """
    now = now or timezone.now()
    cutoff = now - timedelta(minutes=settings.ORDER_DOCUMENT_RETENTION_MINUTES)
    result = {"documents": 0, "legacy_documents": 0}

    documents = (
        OrderDocument.objects.filter(created_at__lte=cutoff)
        .exclude(document="")
        .iterator()
    )
    for document in documents:
        if not _remove_file(document.document):
            continue
        document.document = ""
        document.file_deleted_at = now
        document.save(update_fields=["document", "file_deleted_at"])
        result["documents"] += 1

    # Orders created before multi-file uploads stored a single file directly on
    # Order. Keep these legacy records usable as metadata too.
    legacy_orders = Order.objects.filter(created_at__lte=cutoff).exclude(document="").iterator()
    for order in legacy_orders:
        if not _remove_file(order.document):
            continue
        order.document = ""
        order.document_deleted_at = now
        order.save(update_fields=["document", "document_deleted_at", "updated_at"])
        result["legacy_documents"] += 1

    return result

"""Opportunistically remove expired uploads on active API traffic."""

import logging
import threading
import time

from django.conf import settings

from .retention import purge_expired_order_documents


logger = logging.getLogger(__name__)


class ExpiredOrderDocumentCleanupMiddleware:
    """Run cleanup at most once per process per configured interval.

    A Free Render service cannot run a persistent background worker. This
    makes deletion happen on the first API request after the retention period.
    """

    _last_cleanup = 0.0
    _lock = threading.Lock()

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/"):
            self._cleanup_if_due()
        return self.get_response(request)

    @classmethod
    def _cleanup_if_due(cls):
        now = time.monotonic()
        if now - cls._last_cleanup < settings.ORDER_DOCUMENT_CLEANUP_INTERVAL_SECONDS:
            return
        if not cls._lock.acquire(blocking=False):
            return
        try:
            # Record the attempt first so a temporary storage/database issue
            # cannot add cleanup work to every incoming request.
            cls._last_cleanup = now
            purge_expired_order_documents()
        except Exception:
            logger.exception("Expired customer-document cleanup failed")
        finally:
            cls._lock.release()

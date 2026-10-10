from datetime import timedelta
from io import BytesIO
import mimetypes
from pathlib import Path

from django.db import transaction
from django.db.models import Count, Q, Sum
from django.db.models.functions import TruncDate
from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from shops.models import Shop

from .models import Order, OrderDocument
from .page_counting import render_file_to_pdf_bytes
from .serializers import (
    CreateGuestOrderSerializer,
    GuestOrderResponseSerializer,
    ShopOrderSerializer,
    UpdateOrderStatusSerializer,
)


def shop_queryset_for(user):
    if user.is_superuser or user.role == user.Role.PLATFORM_ADMIN:
        return Shop.objects.all()
    return Shop.objects.filter(owner=user)


class ShopOrderPagination(PageNumberPagination):
    page_size = 20
    max_page_size = 20


class GuestOrderCreateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, slug):
        try:
            shop = Shop.objects.get(slug=slug, is_accepting_orders=True)
        except Shop.DoesNotExist as error:
            raise NotFound("This shop is not accepting orders right now.") from error

        serializer = CreateGuestOrderSerializer(data=request.data, context={"shop": shop})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(GuestOrderResponseSerializer(order).data, status=status.HTTP_201_CREATED)


class ShopOrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShopOrderSerializer
    pagination_class = ShopOrderPagination

    def get_queryset(self):
        orders = (
            Order.objects.filter(shop__in=shop_queryset_for(self.request.user))
            .select_related("shop")
            .prefetch_related("documents")
        )
        view = self.request.query_params.get("view")
        if view == "unpaid":
            orders = orders.filter(payment_status=Order.PaymentStatus.PENDING)
        elif view == "paid":
            orders = orders.filter(
                payment_status=Order.PaymentStatus.MARKED_PAID,
            ).exclude(status=Order.Status.COLLECTED)
        elif view == "collected":
            orders = orders.filter(status=Order.Status.COLLECTED)
        else:
            # Backwards-compatible filters for existing API consumers.
            payment_status = self.request.query_params.get("payment_status")
            if payment_status == Order.PaymentStatus.MARKED_PAID:
                orders = orders.filter(payment_status=Order.PaymentStatus.MARKED_PAID)
            elif payment_status == Order.PaymentStatus.PENDING:
                orders = orders.filter(payment_status=Order.PaymentStatus.PENDING)
        return orders


class ShopOrderStatusView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateOrderStatusSerializer
    http_method_names = ["patch"]

    def get_queryset(self):
        return Order.objects.filter(shop__in=shop_queryset_for(self.request.user))

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        if (
            request.data.get("status") == Order.Status.COLLECTED
            and order.payment_status != Order.PaymentStatus.MARKED_PAID
        ):
            return Response(
                {"detail": "Record the shop payment before marking this order collected."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        response = super().patch(request, *args, **kwargs)
        order = self.get_object()
        return Response(ShopOrderSerializer(order, context={"request": request}).data, status=response.status_code)


class ShopOrderPaymentReceivedView(APIView):
    """Only the shop can record an in-person UPI/cash payment."""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.select_related("shop").get(pk=pk, shop__owner=request.user)
        except Order.DoesNotExist as error:
            raise NotFound("Order not found.") from error
        if order.status == Order.Status.CANCELLED:
            return Response({"detail": "A cancelled order cannot be marked paid."}, status=status.HTTP_409_CONFLICT)
        if order.payment_status != Order.PaymentStatus.MARKED_PAID:
            order.payment_status = Order.PaymentStatus.MARKED_PAID
            order.payment_marked_at = timezone.now()
            order.save(update_fields=["payment_status", "payment_marked_at", "updated_at"])
        return Response(ShopOrderSerializer(order, context={"request": request}).data)


class ShopPendingOrderDeleteView(APIView):
    """Shop owners may remove their own orders only before payment is marked."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            order = (
                Order.objects.select_related("shop")
                .prefetch_related("documents")
                .get(pk=pk, shop__owner=request.user)
            )
        except Order.DoesNotExist as error:
            raise NotFound("Order not found.") from error

        if order.payment_status != Order.PaymentStatus.PENDING:
            return Response(
                {"detail": "Paid orders are protected and cannot be deleted."},
                status=status.HTTP_409_CONFLICT,
            )

        # Django does not remove files from storage on a cascading database
        # delete, so keep their references and remove them after the row is gone.
        uploaded_files = [document.document for document in order.documents.all()]
        if order.document:
            uploaded_files.append(order.document)
        with transaction.atomic():
            order.delete()
        for uploaded_file in uploaded_files:
            uploaded_file.delete(save=False)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.select_related("shop").get(pk=pk)
        except Order.DoesNotExist as error:
            raise Http404 from error
        if not shop_queryset_for(request.user).filter(pk=order.shop_id).exists():
            raise PermissionDenied("You do not have access to this document.")
        if not order.document:
            raise Http404
        return FileResponse(order.document.open("rb"), as_attachment=True, filename=order.original_filename)


def inline_print_response(file_field, filename):
    """Return a private document inline so the browser can show its print UI."""
    extension = Path(filename).suffix.lower()
    if extension == ".pdf" or extension in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"}:
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
        return FileResponse(file_field.open("rb"), as_attachment=False, filename=filename, content_type=content_type)
    try:
        pdf_bytes = render_file_to_pdf_bytes(file_field, filename)
    except ValidationError as error:
        return Response({"detail": error.detail}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    return FileResponse(
        BytesIO(pdf_bytes),
        as_attachment=False,
        filename=f"{Path(filename).stem}.pdf",
        content_type="application/pdf",
    )


class OrderDocumentPrintView(APIView):
    """Inline print preview for a legacy one-file order."""

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.select_related("shop").get(pk=pk)
        except Order.DoesNotExist as error:
            raise Http404 from error
        if not shop_queryset_for(request.user).filter(pk=order.shop_id).exists():
            raise PermissionDenied("You do not have access to this document.")
        if not order.document:
            raise Http404
        return inline_print_response(order.document, order.original_filename)


class UploadedOrderDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            document = OrderDocument.objects.select_related("order__shop").get(pk=pk)
        except OrderDocument.DoesNotExist as error:
            raise Http404 from error
        if not shop_queryset_for(request.user).filter(pk=document.order.shop_id).exists():
            raise PermissionDenied("You do not have access to this document.")
        return FileResponse(document.document.open("rb"), as_attachment=True, filename=document.original_filename)


class UploadedOrderDocumentPrintView(APIView):
    """Inline print preview for a file in a multi-file order."""

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            document = OrderDocument.objects.select_related("order__shop").get(pk=pk)
        except OrderDocument.DoesNotExist as error:
            raise Http404 from error
        if not shop_queryset_for(request.user).filter(pk=document.order.shop_id).exists():
            raise PermissionDenied("You do not have access to this document.")
        return inline_print_response(document.document, document.original_filename)


class ShopAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_orders = Order.objects.filter(shop__in=shop_queryset_for(request.user))
        today = timezone.localdate()
        start_date = today - timedelta(days=6)
        recent_orders = all_orders.filter(created_at__date__gte=start_date)
        daily_rows = recent_orders.values(day=TruncDate("created_at")).annotate(
            orders=Count("id"),
            paid_orders=Count("id", filter=Q(payment_status=Order.PaymentStatus.MARKED_PAID)),
            revenue=Sum("print_amount", filter=Q(payment_status=Order.PaymentStatus.MARKED_PAID)),
        )
        daily_lookup = {
            row["day"]: {
                "orders": row["orders"],
                "paid_orders": row["paid_orders"],
                "revenue": str(row["revenue"] or 0),
            }
            for row in daily_rows
        }
        last_seven_days = []
        for days_from_start in range(7):
            day = start_date + timedelta(days=days_from_start)
            last_seven_days.append({"date": day.isoformat(), **daily_lookup.get(day, {"orders": 0, "paid_orders": 0, "revenue": "0"})})

        today_orders = all_orders.filter(created_at__date=today)
        today_revenue = today_orders.filter(payment_status=Order.PaymentStatus.MARKED_PAID).aggregate(
            value=Sum("print_amount")
        )["value"]
        return Response({
            "today": {
                "orders": today_orders.count(),
                "paid_orders": today_orders.filter(payment_status=Order.PaymentStatus.MARKED_PAID).count(),
                "ready_orders": today_orders.filter(status=Order.Status.READY).count(),
                "revenue": str(today_revenue or 0),
            },
            "last_seven_days": last_seven_days,
        })

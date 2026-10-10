from decimal import Decimal

from django.db.models import Count, DecimalField, Q, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from .models import Shop
from .permissions import IsPlatformAdmin
from .serializers import CreateShopSerializer, PublicShopSerializer, ShopSettingsSerializer, ShopSerializer


def shops_for(user):
    if user.is_superuser or user.role == user.Role.PLATFORM_ADMIN:
        return Shop.objects.filter(is_active=True)
    return Shop.objects.filter(owner=user, is_active=True)


class AdminShopListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsPlatformAdmin]

    def get_queryset(self):
        return Shop.objects.select_related("owner").filter(is_active=True)

    def get_serializer_class(self):
        return CreateShopSerializer if self.request.method == "POST" else ShopSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateShopSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shop = serializer.save()
        return Response(
            ShopSerializer(shop, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )


class AdminShopDeleteView(generics.DestroyAPIView):
    """Retire a shop without destroying its order/payment audit trail."""

    permission_classes = [IsPlatformAdmin]
    queryset = Shop.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

    def perform_destroy(self, shop):
        shop.is_active = False
        shop.is_accepting_orders = False
        shop.save(update_fields=["is_active", "is_accepting_orders", "updated_at"])


class AdminShopEarningsView(APIView):
    """Platform-only earnings report with one immutable row per shop."""

    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        money_field = DecimalField(max_digits=12, decimal_places=2)
        paid_order = Q(orders__payment_status=Order.PaymentStatus.MARKED_PAID)
        zero = Value(Decimal("0.00"), output_field=money_field)
        shops = (
            Shop.objects.select_related("owner")
            .annotate(
                total_orders=Count("orders", distinct=True),
                paid_orders=Count("orders", filter=paid_order, distinct=True),
                shop_earnings=Coalesce(Sum("orders__print_amount", filter=paid_order), zero, output_field=money_field),
                platform_earnings=Coalesce(Sum("orders__convenience_fee", filter=paid_order), zero, output_field=money_field),
                customer_payments=Coalesce(Sum("orders__total_amount", filter=paid_order), zero, output_field=money_field),
            )
            .order_by("name")
        )
        rows = [
            {
                "shop_id": shop.id,
                "shop_name": shop.name,
                "shop_slug": shop.slug,
                "is_active": shop.is_active,
                "owner_name": shop.owner.name,
                "total_orders": shop.total_orders,
                "paid_orders": shop.paid_orders,
                "shop_earnings": str(shop.shop_earnings),
                "platform_earnings": str(shop.platform_earnings),
                "customer_payments": str(shop.customer_payments),
            }
            for shop in shops
        ]
        return Response(
            {
                "summary": {
                    "shops": len(rows),
                    "paid_orders": sum(row["paid_orders"] for row in rows),
                    "shop_earnings": str(sum((Decimal(row["shop_earnings"]) for row in rows), Decimal("0.00"))),
                    "platform_earnings": str(sum((Decimal(row["platform_earnings"]) for row in rows), Decimal("0.00"))),
                    "customer_payments": str(sum((Decimal(row["customer_payments"]) for row in rows), Decimal("0.00"))),
                },
                "shops": rows,
            }
        )


class PublicShopDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = PublicShopSerializer
    lookup_field = "slug"
    queryset = Shop.objects.filter(is_active=True)


class ShopPricingListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShopSettingsSerializer

    def get_queryset(self):
        return shops_for(self.request.user)


class ShopPricingDetailView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShopSettingsSerializer
    http_method_names = ["patch"]

    def get_queryset(self):
        return shops_for(self.request.user)

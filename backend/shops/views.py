from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

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

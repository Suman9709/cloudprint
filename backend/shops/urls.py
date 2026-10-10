from django.urls import path

from .views import (
    AdminShopDeleteView,
    AdminShopEarningsView,
    AdminShopListCreateView,
    PublicShopDetailView,
    ShopPricingDetailView,
    ShopPricingListView,
)


urlpatterns = [
    path("admin/analytics/", AdminShopEarningsView.as_view(), name="admin-shop-earnings"),
    path("admin/shops/", AdminShopListCreateView.as_view(), name="admin-shop-list-create"),
    path("admin/shops/<int:pk>/", AdminShopDeleteView.as_view(), name="admin-shop-delete"),
    path("dashboard/settings/", ShopPricingListView.as_view(), name="shop-pricing-list"),
    path("dashboard/settings/<int:pk>/", ShopPricingDetailView.as_view(), name="shop-pricing-detail"),
    path("<slug:slug>/", PublicShopDetailView.as_view(), name="public-shop-detail"),
]

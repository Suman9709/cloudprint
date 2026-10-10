from django.urls import path

from .views import (
    GuestOrderCreateView,
    GuestOrderPaymentView,
    OrderDocumentView,
    OrderDocumentPrintView,
    UploadedOrderDocumentView,
    UploadedOrderDocumentPrintView,
    ShopOrderListView,
    ShopPendingOrderDeleteView,
    ShopAnalyticsView,
    ShopOrderStatusView,
)


urlpatterns = [
    path("shop/<slug:slug>/", GuestOrderCreateView.as_view(), name="guest-order-create"),
    path("<int:pk>/payment/", GuestOrderPaymentView.as_view(), name="guest-order-payment"),
    path("dashboard/", ShopOrderListView.as_view(), name="shop-order-list"),
    path("dashboard/analytics/", ShopAnalyticsView.as_view(), name="shop-analytics"),
    path("<int:pk>/status/", ShopOrderStatusView.as_view(), name="shop-order-status"),
    path("<int:pk>/", ShopPendingOrderDeleteView.as_view(), name="shop-pending-order-delete"),
    path("<int:pk>/document/", OrderDocumentView.as_view(), name="order-document"),
    path("<int:pk>/print/", OrderDocumentPrintView.as_view(), name="order-document-print"),
    path("documents/<int:pk>/download/", UploadedOrderDocumentView.as_view(), name="uploaded-order-document"),
    path("documents/<int:pk>/print/", UploadedOrderDocumentPrintView.as_view(), name="uploaded-order-document-print"),
]

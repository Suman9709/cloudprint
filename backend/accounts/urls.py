
from django.urls import path
from .views import (
    CookieTokenRefreshView,
    CsrfTokenView,
    CurrentUserView,
    LoginView,
    LogoutView,
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf-cookie'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

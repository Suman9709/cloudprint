
from django.urls import path
from .views import (
    CookieTokenRefreshView,
    CsrfTokenView,
    LoginView,
    LogoutView,
    StudentSignupView,
)

urlpatterns = [
    path('signup/', StudentSignupView.as_view(), name='student-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf-cookie'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

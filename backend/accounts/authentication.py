from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework import exceptions
from rest_framework.permissions import SAFE_METHODS
from rest_framework_simplejwt.authentication import JWTAuthentication


class CSRFCheck(CsrfViewMiddleware):
    def _reject(self, request, reason):
        return reason


def enforce_csrf(request):
    check = CSRFCheck(lambda request: None)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookieJWTAuthentication(JWTAuthentication):
    """Authenticate JWT access tokens stored in an HttpOnly cookie."""

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.JWT_ACCESS_COOKIE)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        if request.method not in SAFE_METHODS:
            enforce_csrf(request)

        return self.get_user(validated_token), validated_token

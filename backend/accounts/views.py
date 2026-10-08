from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .authentication import enforce_csrf
from .serializers import LoginSerializer, StudentSignupSerializer


def user_data(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "role": user.role,
    }


def set_auth_cookies(response, refresh):
    cookie_options = {
        "httponly": True,
        "secure": settings.JWT_COOKIE_SECURE,
        "samesite": settings.JWT_COOKIE_SAMESITE,
        "path": "/",
    }
    response.set_cookie(
        key=settings.JWT_ACCESS_COOKIE,
        value=str(refresh.access_token),
        max_age=settings.JWT_ACCESS_COOKIE_MAX_AGE,
        **cookie_options,
    )
    response.set_cookie(
        key=settings.JWT_REFRESH_COOKIE,
        value=str(refresh),
        max_age=settings.JWT_REFRESH_COOKIE_MAX_AGE,
        **cookie_options,
    )


def clear_auth_cookies(response):
    cookie_options = {
        "path": "/",
        "samesite": settings.JWT_COOKIE_SAMESITE,
    }
    response.delete_cookie(settings.JWT_ACCESS_COOKIE, **cookie_options)
    response.delete_cookie(settings.JWT_REFRESH_COOKIE, **cookie_options)


class StudentSignupView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = StudentSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        response = Response(
            {"message": "User created successfully", "user": user_data(user)},
            status=status.HTTP_201_CREATED,
        )
        set_auth_cookies(response, refresh)
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        response = Response(
            {"message": "Login successful", "user": user_data(user)},
            status=status.HTTP_200_OK,
        )
        set_auth_cookies(response, refresh)
        return response


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"detail": "CSRF cookie set"})


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        enforce_csrf(request)
        token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)
        if not token:
            raise AuthenticationFailed("Refresh token is missing")

        try:
            refresh = RefreshToken(token)
        except TokenError as error:
            raise AuthenticationFailed("Refresh token is invalid or expired") from error

        response = Response({"message": "Access token refreshed"})
        set_auth_cookies(response, refresh)
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        enforce_csrf(request)
        response = Response({"message": "Logged out successfully"})
        clear_auth_cookies(response)
        return response

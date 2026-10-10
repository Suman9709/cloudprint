from rest_framework.permissions import BasePermission


class IsPlatformAdmin(BasePermission):
    message = "Only platform administrators can manage shops."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user.role == user.Role.PLATFORM_ADMIN)
        )

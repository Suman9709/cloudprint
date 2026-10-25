from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class CloudPrintUserCreationForm(UserCreationForm):
    """Use password1/password2 so Django hashes passwords for new users."""

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email", "username", "name", "role")


class CloudPrintUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    form = CloudPrintUserChangeForm
    add_form = CloudPrintUserCreationForm
    model = User
    ordering = ("email",)
    list_display = ("email", "username", "name", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_superuser", "is_active")
    search_fields = ("email", "username", "name")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal information", {"fields": ("username", "name")}),
        (
            "Permissions",
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "name", "role", "password1", "password2"),
            },
        ),
    )

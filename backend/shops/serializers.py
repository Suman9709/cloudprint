from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import Shop


User = get_user_model()


class ShopSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.name", read_only=True)
    owner_email = serializers.EmailField(source="owner.email", read_only=True)
    public_url = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = [
            "id", "name", "slug", "address", "is_accepting_orders", "owner_name",
            "owner_email", "phone", "black_white_price_per_page", "colour_price_per_page",
            "spiral_bind_cost", "public_url", "created_at",
        ]

    def get_public_url(self, shop):
        return f"{settings.FRONTEND_URL.rstrip('/')}/shop/{shop.slug}"


class CreateShopSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(write_only=True, max_length=100)
    owner_email = serializers.EmailField(write_only=True)
    owner_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    class Meta:
        model = Shop
        fields = [
            "name", "slug", "address", "phone", "black_white_price_per_page", "colour_price_per_page",
            "spiral_bind_cost", "is_accepting_orders", "owner_name", "owner_email",
            "owner_password",
        ]

    def validate_owner_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account already uses this email.")
        return value.lower()

    @staticmethod
    def _username_for(email):
        base = email.split("@", 1)[0][:140] or "shop"
        username = base
        index = 2
        while User.objects.filter(username=username).exists():
            suffix = f"-{index}"
            username = f"{base[:150 - len(suffix)]}{suffix}"
            index += 1
        return username

    @transaction.atomic
    def create(self, validated_data):
        owner_name = validated_data.pop("owner_name")
        owner_email = validated_data.pop("owner_email")
        owner_password = validated_data.pop("owner_password")
        owner = User.objects.create_user(
            username=self._username_for(owner_email),
            email=owner_email,
            name=owner_name,
            password=owner_password,
            role=User.Role.SHOP,
        )
        return Shop.objects.create(owner=owner, **validated_data)


class PublicShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            "name", "slug", "address", "phone", "black_white_price_per_page",
            "colour_price_per_page", "spiral_bind_cost", "is_accepting_orders",
        ]


class ShopSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            "id", "name", "slug", "address", "phone", "is_accepting_orders",
            "black_white_price_per_page", "colour_price_per_page", "spiral_bind_cost",
        ]
        extra_kwargs = {"slug": {"read_only": True}}

    def validate(self, attrs):
        for field in ("black_white_price_per_page", "colour_price_per_page", "spiral_bind_cost"):
            value = attrs.get(field)
            if value is not None and value < 0:
                raise serializers.ValidationError({field: "This amount cannot be negative."})
        return attrs

    def validate_black_white_price_per_page(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price per page must be greater than zero.")
        return value

    def validate_colour_price_per_page(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price per page must be greater than zero.")
        return value

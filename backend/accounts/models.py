from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        SHOP = 'shop', 'Shop'
        PLATFORM_ADMIN = 'platform_admin', 'Platform Admin'
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    # Students place orders as guests; only shop staff and platform admins have accounts.
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.SHOP)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    def __str__(self):
        return self.name or self.email


class ShopModel(models.Model):
    """Deprecated pre-redesign record kept only to avoid deleting existing data.

    New shops must use ``shops.Shop`` and an owner ``User`` account instead.
    This model is deliberately not exposed in the admin or application APIs.
    """

    shopname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.shopname

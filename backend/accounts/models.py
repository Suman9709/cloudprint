from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        SHOP = 'shop', 'Shop'
        PLATEFORM_ADMIN = 'platform_admin', 'Platform Admin'
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    def __str__(self):
        return self.name
    
class ShopModel(models.Model):
    shopname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.shopname
    

    
    
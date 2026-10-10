from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User

from .models import Shop


class ShopAdministrationTests(APITestCase):
    def test_platform_admin_creates_shop_url_and_owner_account(self):
        admin = User.objects.create_user(
            username="platform-admin",
            email="admin@example.com",
            name="Platform Admin",
            password="safe-password-123",
            role=User.Role.PLATFORM_ADMIN,
        )
        self.client.force_authenticate(admin)

        response = self.client.post(
            "/api/shops/admin/shops/",
            {
                "name": "Library Copy Centre",
                "slug": "library-copy",
                "address": "Main Library",
                "owner_name": "Sam Shop",
                "owner_email": "sam@example.com",
                "owner_password": "owner-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        shop = Shop.objects.get(slug="library-copy")
        self.assertEqual(shop.owner.email, "sam@example.com")
        self.assertTrue(shop.owner.check_password("owner-password-123"))
        self.assertEqual(response.data["public_url"], "http://localhost:5173/shop/library-copy")

    def test_shop_owner_can_update_their_own_price_per_page(self):
        owner = User.objects.create_user(
            username="shop-owner",
            email="shop@example.com",
            name="Shop Owner",
            password="safe-password-123",
            role=User.Role.SHOP,
        )
        shop = Shop.objects.create(owner=owner, name="Copy Point", slug="copy-point")
        self.client.force_authenticate(owner)

        response = self.client.patch(
            f"/api/shops/dashboard/settings/{shop.id}/",
            {"black_white_price_per_page": "4.25"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        shop.refresh_from_db()
        self.assertEqual(str(shop.black_white_price_per_page), "4.25")

    def test_platform_admin_can_retire_a_shop_without_deleting_its_owner(self):
        admin = User.objects.create_user(
            username="delete-admin",
            email="delete-admin@example.com",
            name="Delete Admin",
            password="safe-password-123",
            role=User.Role.PLATFORM_ADMIN,
        )
        owner = User.objects.create_user(
            username="retired-owner",
            email="retired-owner@example.com",
            name="Retired Owner",
            password="safe-password-123",
            role=User.Role.SHOP,
        )
        shop = Shop.objects.create(owner=owner, name="Retired Copy", slug="retired-copy")
        self.client.force_authenticate(admin)

        response = self.client.delete(f"/api/shops/admin/shops/{shop.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        shop.refresh_from_db()
        self.assertFalse(shop.is_active)
        self.assertFalse(shop.is_accepting_orders)
        self.assertTrue(User.objects.filter(pk=owner.pk).exists())
        self.client.force_authenticate(user=None)
        self.assertEqual(self.client.get("/api/shops/retired-copy/").status_code, status.HTTP_404_NOT_FOUND)

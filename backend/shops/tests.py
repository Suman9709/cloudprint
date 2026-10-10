from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from orders.models import Order

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

    def test_platform_admin_sees_each_shop_and_platform_earnings_separately(self):
        admin = User.objects.create_user(
            username="report-admin",
            email="report-admin@example.com",
            name="Report Admin",
            password="safe-password-123",
            role=User.Role.PLATFORM_ADMIN,
        )
        owner = User.objects.create_user(
            username="earning-owner",
            email="earning-owner@example.com",
            name="Earning Owner",
            password="safe-password-123",
            role=User.Role.SHOP,
        )
        shop = Shop.objects.create(owner=owner, name="Earning Copy", slug="earning-copy")
        Order.objects.create(
            shop=shop,
            pickup_code="8484",
            original_filename="paid.pdf",
            payment_status=Order.PaymentStatus.MARKED_PAID,
            print_amount="50.00",
            convenience_fee="3.00",
            total_amount="53.00",
        )
        Order.objects.create(
            shop=shop,
            pickup_code="8585",
            original_filename="unpaid.pdf",
            print_amount="20.00",
            convenience_fee="3.00",
            total_amount="23.00",
        )
        self.client.force_authenticate(admin)

        response = self.client.get("/api/shops/admin/analytics/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["summary"]["paid_orders"], 1)
        self.assertEqual(response.data["summary"]["shop_earnings"], "50.00")
        self.assertEqual(response.data["summary"]["platform_earnings"], "3.00")
        self.assertEqual(response.data["summary"]["customer_payments"], "53.00")
        self.assertEqual(response.data["shops"][0]["total_orders"], 2)

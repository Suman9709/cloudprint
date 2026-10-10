import io
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from pypdf import PdfWriter
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from shops.models import Shop

from .models import Order


def pdf_upload(name, pages=1):
    output = io.BytesIO()
    writer = PdfWriter()
    for _ in range(pages):
        writer.add_blank_page(width=72, height=72)
    writer.write(output)
    return SimpleUploadedFile(name, output.getvalue(), content_type="application/pdf")


@override_settings(MEDIA_ROOT=tempfile.gettempdir())
class GuestOrderFlowTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="library-owner",
            email="owner@example.com",
            name="Library Owner",
            password="safe-password-123",
            role=User.Role.SHOP,
        )
        self.shop = Shop.objects.create(owner=self.owner, name="Library Print", slug="library-print")

    def tearDown(self):
        for order in Order.objects.all():
            for document in order.documents.all():
                document.document.delete(save=False)
            if order.document:
                order.document.delete(save=False)
        super().tearDown()

    def test_guest_can_submit_a_supported_document_and_receive_a_four_digit_code(self):
        response = self.client.post(
            "/api/orders/shop/library-print/",
            {
                # The legacy singular field remains supported for API clients.
                "document": pdf_upload("notes.pdf"),
                "print_mode": "black_white",
                "sides": "double",
                "copies": 2,
                "finishing": "staple",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertRegex(response.data["pickup_code"], r"^\d{4}$")
        self.assertEqual(response.data["shop_name"], "Library Print")
        self.assertEqual(response.data["page_count"], 1)
        self.assertEqual(response.data["documents"][0]["page_count_status"], Order.PageCountStatus.EXACT)
        order = Order.objects.get()
        self.assertEqual(order.status, Order.Status.SUBMITTED)
        self.assertEqual(order.documents.count(), 1)

    def test_multiple_pdfs_are_counted_together_and_the_quote_uses_the_total(self):
        self.shop.black_white_price_per_page = "3.50"
        self.shop.save(update_fields=["black_white_price_per_page"])
        response = self.client.post(
            "/api/orders/shop/library-print/",
            {
                "documents": [pdf_upload("chapter-one.pdf", 2), pdf_upload("chapter-two.pdf", 3)],
                "copies": 2,
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["page_count"], 5)
        self.assertEqual(response.data["total_amount"], "35.00")
        self.assertEqual([item["page_count"] for item in response.data["documents"]], [2, 3])
        order = Order.objects.get()
        self.assertEqual(order.documents.count(), 2)
        self.assertEqual(order.page_count_status, Order.PageCountStatus.EXACT)

    def test_ten_page_pdf_is_quoted_as_twenty_rupees_at_the_default_rate(self):
        response = self.client.post(
            "/api/orders/shop/library-print/",
            {"document": pdf_upload("ten-pages.pdf", 10)},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["page_count"], 10)
        self.assertEqual(response.data["price_per_page"], "2.00")
        self.assertEqual(response.data["total_amount"], "20.00")
        self.assertEqual(response.data["documents"][0]["page_count"], 10)

    def test_guest_payment_confirmation_marks_the_order_paid_and_keeps_the_quoted_price(self):
        self.shop.black_white_price_per_page = "3.50"
        self.shop.save(update_fields=["black_white_price_per_page"])
        create_response = self.client.post(
            "/api/orders/shop/library-print/",
            {"document": pdf_upload("notes.pdf", 3), "copies": 2},
            format="multipart",
        )

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data["total_amount"], "21.00")
        payment_response = self.client.post(
            f"/api/orders/{create_response.data['id']}/payment/",
            {"payment_token": create_response.data["payment_token"]},
            format="json",
        )

        self.assertEqual(payment_response.status_code, status.HTTP_200_OK)
        self.assertEqual(payment_response.data["payment_status"], Order.PaymentStatus.MARKED_PAID)

    def test_colour_and_spiral_prices_are_included_in_the_guest_quote(self):
        self.shop.colour_price_per_page = "6.00"
        self.shop.spiral_bind_cost = "15.00"
        self.shop.save(update_fields=["colour_price_per_page", "spiral_bind_cost"])
        response = self.client.post(
            "/api/orders/shop/library-print/",
            {"document": pdf_upload("slides.pdf", 2), "print_mode": "colour", "finishing": "spiral_bind"},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["price_per_page"], "6.00")
        self.assertEqual(response.data["finishing_cost"], "15.00")
        self.assertEqual(response.data["total_amount"], "27.00")

    def test_shop_owner_only_sees_their_shop_orders(self):
        other_owner = User.objects.create_user(
            username="other-owner",
            email="other@example.com",
            name="Other Owner",
            password="safe-password-123",
            role=User.Role.SHOP,
        )
        other_shop = Shop.objects.create(owner=other_owner, name="Other Print", slug="other-print")
        first = Order.objects.create(
            shop=self.shop,
            pickup_code="1234",
            original_filename="mine.pdf",
            document=pdf_upload("mine.pdf"),
        )
        Order.objects.create(
            shop=other_shop,
            pickup_code="5678",
            original_filename="other.pdf",
            document=pdf_upload("other.pdf"),
        )

        self.client.force_authenticate(self.owner)
        response = self.client.get("/api/orders/dashboard/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual([item["id"] for item in response.data["results"]], [first.id])
        self.assertEqual(response.data["results"][0]["documents"][0]["original_filename"], "mine.pdf")

    def test_shop_analytics_returns_a_seven_day_summary(self):
        Order.objects.create(
            shop=self.shop,
            pickup_code="9999",
            original_filename="paid.pdf",
            document=pdf_upload("paid.pdf"),
            payment_status=Order.PaymentStatus.MARKED_PAID,
            total_amount="10.00",
        )
        self.client.force_authenticate(self.owner)

        response = self.client.get("/api/orders/dashboard/analytics/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["last_seven_days"]), 7)
        self.assertEqual(response.data["today"]["paid_orders"], 1)

    def test_shop_owner_can_delete_their_own_pending_order(self):
        order = Order.objects.create(
            shop=self.shop,
            pickup_code="4321",
            original_filename="unpaid.pdf",
        )
        self.client.force_authenticate(self.owner)

        response = self.client.delete(f"/api/orders/{order.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Order.objects.filter(pk=order.pk).exists())

    def test_shop_owner_cannot_delete_a_paid_order(self):
        order = Order.objects.create(
            shop=self.shop,
            pickup_code="7654",
            original_filename="paid.pdf",
            payment_status=Order.PaymentStatus.MARKED_PAID,
        )
        self.client.force_authenticate(self.owner)

        response = self.client.delete(f"/api/orders/{order.id}/")

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertTrue(Order.objects.filter(pk=order.pk).exists())

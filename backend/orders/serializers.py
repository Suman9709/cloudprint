import os
import secrets
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from rest_framework import serializers

from .models import Order, OrderDocument
from .page_counting import count_uploaded_file


ALLOWED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".odt", ".ods", ".odp",
    ".rtf", ".txt", ".csv", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff",
}
MAX_FILE_SIZE = 50 * 1024 * 1024
MAX_FILES_PER_ORDER = 10
MAX_ORDER_UPLOAD_SIZE = 100 * 1024 * 1024
MAX_PAGES_PER_ORDER = 10_000


def new_pickup_code():
    """Generate an unused, human-friendly four digit order collection code."""
    for _ in range(50):
        code = str(secrets.randbelow(9000) + 1000)
        if not Order.objects.filter(pickup_code=code).exists():
            return code
    raise serializers.ValidationError("Could not issue a pickup code. Please try again.")


class UploadedFilesField(serializers.ListField):
    """Read repeated ``documents`` multipart fields sent by browser FormData."""

    child = serializers.FileField()

    def get_value(self, dictionary):
        if hasattr(dictionary, "getlist"):
            values = dictionary.getlist(self.field_name)
            if values:
                return values
        return super().get_value(dictionary)


class CreateGuestOrderSerializer(serializers.Serializer):
    # ``document`` stays compatible with the old single-file frontend/API.
    # New clients append each selected file as ``documents`` in FormData.
    documents = UploadedFilesField(required=False, write_only=True)
    document = serializers.FileField(required=False, write_only=True)
    customer_name = serializers.CharField(required=False, allow_blank=True, max_length=100)
    print_mode = serializers.CharField(required=False, default="black_white")
    sides = serializers.CharField(required=False, default="single")
    copies = serializers.IntegerField(required=False, default=1)
    finishing = serializers.CharField(required=False, default="none")

    def validate(self, attrs):
        documents = attrs.pop("documents", [])
        legacy_document = attrs.pop("document", None)
        if documents and legacy_document:
            raise serializers.ValidationError("Send either document or documents, not both.")
        uploads = documents or ([legacy_document] if legacy_document else [])
        if not uploads:
            raise serializers.ValidationError({"documents": "Choose at least one file."})
        if len(uploads) > MAX_FILES_PER_ORDER:
            raise serializers.ValidationError({"documents": f"Upload at most {MAX_FILES_PER_ORDER} files per order."})

        total_size = 0
        for uploaded_file in uploads:
            extension = os.path.splitext(uploaded_file.name)[1].lower()
            if extension not in ALLOWED_EXTENSIONS:
                raise serializers.ValidationError({"documents": "Upload only printable PDF, Office, OpenDocument, text, or image files."})
            if uploaded_file.size > MAX_FILE_SIZE:
                raise serializers.ValidationError({"documents": f"{uploaded_file.name} is larger than 50 MB."})
            total_size += uploaded_file.size
        if total_size > MAX_ORDER_UPLOAD_SIZE:
            raise serializers.ValidationError({"documents": "The combined upload size must be 100 MB or smaller."})
        attrs["uploads"] = uploads
        return attrs

    def validate_copies(self, copies):
        if not 1 <= copies <= 100:
            raise serializers.ValidationError("Copies must be between 1 and 100.")
        return copies

    def validate_print_mode(self, value):
        if value not in {"black_white", "colour"}:
            raise serializers.ValidationError("Choose black_white or colour.")
        return value

    def validate_sides(self, value):
        if value not in {"single", "double"}:
            raise serializers.ValidationError("Choose single or double.")
        return value

    def validate_finishing(self, value):
        if value not in {"none", "staple", "spiral_bind"}:
            raise serializers.ValidationError("Choose none, staple, or spiral_bind.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        uploads = validated_data.pop("uploads")
        counted_documents = [(uploaded_file, count_uploaded_file(uploaded_file)) for uploaded_file in uploads]
        page_count = sum(result.pages for _, result in counted_documents)
        if page_count > MAX_PAGES_PER_ORDER:
            raise serializers.ValidationError({"documents": "The combined page count cannot exceed 10,000 pages."})

        statuses = [result.status for _, result in counted_documents]
        if Order.PageCountStatus.REVIEW_REQUIRED in statuses:
            page_count_status = Order.PageCountStatus.REVIEW_REQUIRED
        elif Order.PageCountStatus.ESTIMATED in statuses:
            page_count_status = Order.PageCountStatus.ESTIMATED
        else:
            page_count_status = Order.PageCountStatus.EXACT

        shop = self.context["shop"]
        print_mode = validated_data.get("print_mode", "black_white")
        finishing = validated_data.get("finishing", "none")
        price_per_page = shop.colour_price_per_page if print_mode == "colour" else shop.black_white_price_per_page
        finishing_cost = shop.spiral_bind_cost if finishing == "spiral_bind" else Decimal("0.00")
        copies = validated_data.get("copies", 1)
        print_amount = (price_per_page * page_count * copies + finishing_cost).quantize(Decimal("0.01"))
        convenience_fee = settings.CONVENIENCE_FEE.quantize(Decimal("0.01"))
        total_amount = (print_amount + convenience_fee).quantize(Decimal("0.01"))
        original_filename = (
            counted_documents[0][0].name[:255]
            if len(counted_documents) == 1
            else f"{len(counted_documents)} files: {counted_documents[0][0].name[:220]}"
        )
        order = Order.objects.create(
            shop=shop,
            pickup_code=new_pickup_code(),
            original_filename=original_filename,
            page_count=page_count,
            page_count_status=page_count_status,
            price_per_page=price_per_page,
            finishing_cost=finishing_cost,
            print_amount=print_amount,
            convenience_fee=convenience_fee,
            total_amount=total_amount,
            **validated_data,
        )
        OrderDocument.objects.bulk_create([
            OrderDocument(
                order=order,
                document=uploaded_file,
                original_filename=uploaded_file.name[:255],
                page_count=result.pages,
                page_count_status=result.status,
                page_count_method=result.method,
            )
            for uploaded_file, result in counted_documents
        ])
        return order


class OrderDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDocument
        fields = ["id", "original_filename", "page_count", "page_count_status", "page_count_method"]


class GuestOrderResponseSerializer(serializers.ModelSerializer):
    shop_name = serializers.CharField(source="shop.name", read_only=True)
    documents = OrderDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "pickup_code", "payment_token", "shop_name", "original_filename", "page_count", "page_count_status",
            "documents", "copies", "price_per_page", "finishing_cost", "print_amount", "convenience_fee",
            "total_amount", "payment_status", "status", "created_at",
        ]


class ShopOrderSerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "pickup_code", "original_filename", "customer_name", "print_mode", "sides", "copies",
            "page_count", "page_count_status", "finishing", "price_per_page", "finishing_cost", "print_amount",
            "convenience_fee", "total_amount", "payment_status",
            "status", "status_label", "created_at", "updated_at", "documents", "document_url",
        ]

    def get_documents(self, order):
        request = self.context.get("request")
        documents = list(order.documents.all())
        payload = [
            {
                **OrderDocumentSerializer(document).data,
                "document_url": request.build_absolute_uri(f"/api/orders/documents/{document.pk}/download/") if request else None,
            }
            for document in documents
        ]
        # Old single-file orders still work after the database migration.
        if not payload and order.document:
            payload.append({
                "id": None,
                "original_filename": order.original_filename,
                "page_count": order.page_count,
                "page_count_status": order.page_count_status,
                "page_count_method": "legacy_order_file",
                "document_url": self.get_document_url(order),
            })
        return payload

    def get_document_url(self, order):
        request = self.context.get("request")
        if not request or not order.document:
            return None
        return request.build_absolute_uri(f"/api/orders/{order.pk}/document/")


class UpdateOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]


class MarkOrderPaidSerializer(serializers.Serializer):
    payment_token = serializers.UUIDField()

"""Server-side page counting for printable uploads.

The browser must never be trusted to set a price-sensitive page count. PDFs
are read directly. For Word, spreadsheet, presentation and OpenDocument files
LibreOffice renders a PDF first, which gives the actual printed page count.
When that renderer is not installed, the fallback is labelled as an estimate
or as requiring a shop review rather than pretending it is exact.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
import zipfile
from dataclasses import dataclass
from pathlib import Path
from xml.etree import ElementTree

from django.conf import settings
from rest_framework.exceptions import ValidationError

from .models import Order


@dataclass(frozen=True)
class PageCountResult:
    pages: int
    status: str
    method: str


def _rewind(uploaded_file):
    try:
        uploaded_file.seek(0)
    except (AttributeError, OSError):
        pass


def _pdf_page_count(file_object):
    try:
        from pypdf import PdfReader
    except ImportError as error:  # pragma: no cover - deployment configuration guard
        raise ValidationError("PDF page counting is not installed on the server.") from error
    try:
        _rewind(file_object)
        return len(PdfReader(file_object).pages)
    except Exception as error:
        raise ValidationError("This PDF could not be read. Upload a valid, non-password-protected PDF.") from error
    finally:
        _rewind(file_object)


def _libreoffice_binary():
    configured_binary = getattr(settings, "LIBREOFFICE_BIN", "")
    if configured_binary and Path(configured_binary).is_file():
        return configured_binary
    return shutil.which("soffice") or shutil.which("libreoffice")


def _converted_pdf_page_count(uploaded_file, filename):
    """Return rendered page count, or None when LibreOffice is not installed."""
    binary = _libreoffice_binary()
    if not binary:
        return None
    suffix = Path(filename).suffix.lower()
    safe_stem = Path(filename).stem.replace(" ", "_") or "document"
    with tempfile.TemporaryDirectory(prefix="cloudprint-page-count-") as workdir:
        source = Path(workdir) / f"{safe_stem}{suffix}"
        _rewind(uploaded_file)
        with source.open("wb") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        _rewind(uploaded_file)
        try:
            completed = subprocess.run(
                [binary, "--headless", "--convert-to", "pdf", "--outdir", workdir, str(source)],
                check=False,
                capture_output=True,
                timeout=90,
            )
        except (OSError, subprocess.TimeoutExpired) as error:
            raise ValidationError("The document converter could not process this file. Upload a PDF or ask the shop to review it.") from error
        if completed.returncode != 0:
            raise ValidationError("The document converter could not read this file. Upload a valid PDF or document.")
        converted_files = list(Path(workdir).glob("*.pdf"))
        if not converted_files:
            raise ValidationError("The document converter did not create a printable PDF.")
        with converted_files[0].open("rb") as converted_pdf:
            return _pdf_page_count(converted_pdf)


def _docx_page_hint(uploaded_file):
    """Use Word's saved page breaks only as an estimate without a renderer."""
    try:
        _rewind(uploaded_file)
        with zipfile.ZipFile(uploaded_file) as archive:
            xml = archive.read("word/document.xml")
        root = ElementTree.fromstring(xml)
        namespace = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
        saved_breaks = len(root.findall(f".//{namespace}lastRenderedPageBreak"))
        explicit_breaks = sum(
            1 for element in root.findall(f".//{namespace}br")
            if element.get(f"{namespace}type") == "page"
        )
        return max(1, saved_breaks + 1, explicit_breaks + 1)
    except (KeyError, OSError, zipfile.BadZipFile, ElementTree.ParseError):
        return 1
    finally:
        _rewind(uploaded_file)


def _pptx_slide_count(uploaded_file):
    try:
        _rewind(uploaded_file)
        with zipfile.ZipFile(uploaded_file) as archive:
            xml = archive.read("ppt/presentation.xml")
        root = ElementTree.fromstring(xml)
        namespace = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
        return max(1, len(root.findall(f".//{namespace}sldId")))
    except (KeyError, OSError, zipfile.BadZipFile, ElementTree.ParseError):
        return 1
    finally:
        _rewind(uploaded_file)


def _text_page_estimate(uploaded_file):
    try:
        _rewind(uploaded_file)
        contents = uploaded_file.read().decode("utf-8", errors="replace")
        lines = max(1, contents.count("\n") + 1)
        return max(contents.count("\f") + 1, (lines + 54) // 55)
    finally:
        _rewind(uploaded_file)


def count_uploaded_file(uploaded_file):
    """Return a per-file count and whether it is exact, estimated or reviewed."""
    extension = os.path.splitext(uploaded_file.name)[1].lower()
    if extension == ".pdf":
        return PageCountResult(_pdf_page_count(uploaded_file), Order.PageCountStatus.EXACT, "pdf_page_tree")
    if extension in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"}:
        return PageCountResult(1, Order.PageCountStatus.EXACT, "single_image")

    rendered_pages = _converted_pdf_page_count(uploaded_file, uploaded_file.name)
    if rendered_pages is not None:
        return PageCountResult(rendered_pages, Order.PageCountStatus.EXACT, "libreoffice_pdf_render")
    if extension == ".pptx":
        return PageCountResult(_pptx_slide_count(uploaded_file), Order.PageCountStatus.ESTIMATED, "slide_count_no_renderer")
    if extension == ".docx":
        return PageCountResult(_docx_page_hint(uploaded_file), Order.PageCountStatus.ESTIMATED, "docx_saved_page_breaks")
    if extension in {".txt", ".csv", ".rtf"}:
        return PageCountResult(_text_page_estimate(uploaded_file), Order.PageCountStatus.ESTIMATED, "text_layout_estimate")
    return PageCountResult(1, Order.PageCountStatus.REVIEW_REQUIRED, "renderer_unavailable")

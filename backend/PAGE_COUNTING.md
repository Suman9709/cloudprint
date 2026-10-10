# Page counting in production

CloudPrint counts PDF pages directly with `pypdf`. For a Word document, Excel
workbook, OpenDocument file, or legacy Office format, the final printed page
count depends on fonts, paper size, margins, and printer layout. The backend
therefore uses LibreOffice in headless mode to render these files to PDF before
counting them.

Install LibreOffice on every server that accepts uploads, then add its executable
to `backend/.env` and restart Django:

```env
# Windows
LIBREOFFICE_BIN=C:\Program Files\LibreOffice\program\soffice.exe

# Linux example
# LIBREOFFICE_BIN=/usr/bin/soffice
```

If LibreOffice is not available, CloudPrint does not label a Word/Office count
as exact. DOCX, PPTX and text files display an estimate where one can be read;
older binary Office files are marked for manual shop review. The shop dashboard
shows that state next to the affected file.

Operational limits are 10 files per order, 50 MB per file, 100 MB combined,
and 10,000 counted pages. Run `pipenv sync` after pulling the project so the
PDF parser is installed.

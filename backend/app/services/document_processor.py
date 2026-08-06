import fitz
from app.services.pdf_service import extract_text_from_pdf
from app.services.text_cleaner import clean_text
from app.services.chunk_service import chunk_text


def process_document(file_path: str):
    """
    Process uploaded document.
    """

    # Count PDF pages
    pdf = fitz.open(file_path)
    page_count = len(pdf)
    pdf.close()

    # Step 1
    extracted_text = extract_text_from_pdf(file_path)

    # Step 2
    cleaned_text = clean_text(extracted_text)

    chunks = chunk_text(cleaned_text)

    print("=" * 80)
    print(f"Total Chunks: {len(chunks)}")
    print("=" * 80)

    for chunk in chunks:
        print("=" * 80)
        print(f"Chunk {chunk['chunk_index']}")
        print(chunk["text"])

    return {
        "chunks": chunks,
        "page_count": page_count,
    }




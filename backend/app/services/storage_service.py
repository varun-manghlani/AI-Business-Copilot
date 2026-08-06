from pathlib import Path
import shutil
import uuid

# backend/app
BASE_DIR = Path(__file__).resolve().parent.parent

# backend/app/knowledge_base/documents
DOCUMENT_FOLDER = BASE_DIR / "knowledge_base" / "documents"


def save_document(upload_file):
    # Create folder if it doesn't exist
    DOCUMENT_FOLDER.mkdir(parents=True, exist_ok=True)

    # Get file extension (.pdf)
    extension = Path(upload_file.filename).suffix

    # Generate unique filename
    stored_filename = f"{uuid.uuid4()}{extension}"

    # Full path of the file
    file_path = DOCUMENT_FOLDER / stored_filename

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return stored_filename, str(file_path)
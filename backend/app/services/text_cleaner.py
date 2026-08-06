import re


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text.
    """

    # Remove multiple spaces
    text = re.sub(r"\s+", " ", text)

    # Remove leading and trailing spaces
    text = text.strip()

    return text
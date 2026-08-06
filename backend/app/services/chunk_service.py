def chunk_text(
    text: str,
    chunk_size: int = 500,
):
    """
    Split text into chunks.
    """

    words = text.split()

    chunks = []

    for index, i in enumerate(range(0, len(words), chunk_size)):

        chunk = " ".join(words[i:i + chunk_size])

        chunks.append(
            {
                "chunk_index": index,
                "text": chunk,
            }
        )

    return chunks
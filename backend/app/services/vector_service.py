import chromadb

client = chromadb.PersistentClient(
    path="app/knowledge_base/vector_db"
)

collection = client.get_or_create_collection(
    name="company_documents"
)


def add_chunks(document, chunks, embeddings):
    """
    Store chunks inside ChromaDB.
    """

    ids = []
    documents = []
    metadatas = []

    for chunk, embedding in zip(chunks, embeddings):

        ids.append(
            f"{document.id}_{chunk['chunk_index']}"
        )

        documents.append(
            chunk["text"]
        )

        metadatas.append(
            {
                "document_id": document.id,
                "filename": document.original_filename,
                "chunk_index": chunk["chunk_index"],
            }
        )

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings.tolist(),
        metadatas=metadatas,
    )


def delete_document_vectors(document_id: int):
    """
    Delete all chunks belonging to a document.
    """

    collection.delete(
        where={
            "document_id": document_id
        }
    )
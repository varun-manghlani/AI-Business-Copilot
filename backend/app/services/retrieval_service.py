from app.services.embedding_service import model
from app.services.vector_service import collection


def search_documents(
    question: str,
    top_k: int = 3,
):
    """
    Search the vector database for relevant chunks.
    """

    question_embedding = model.encode(question)

    results = collection.query(
        query_embeddings=[question_embedding.tolist()],
        n_results=top_k,
    )

    return results
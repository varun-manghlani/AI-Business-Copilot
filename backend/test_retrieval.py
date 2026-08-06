from app.services.retrieval_service import search_documents
from app.services.prompt_builder import build_prompt

question = "When is salary credited?"

results = search_documents(question)

prompt = build_prompt(question, results)

print(prompt)
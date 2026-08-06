from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.chat import router as chat_router
from app.routers.conversation_router import router as conversation_router
from app.routers.knowledge import router as knowledge_router
from app.routers.auth import router as auth_router
from app.routers.settings import router as settings_router
from app.routers.user import router as user_router
from app.routers.email import router as email_router
from app.routers.report import router as report_router
from app.routers.meeting import router as meeting_router
from app.routers.customer_support import router as customer_support_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to AI Business Copilot!"}


@app.get("/health")
def health():
    return {"status": "healthy"}


app.include_router(chat_router)
app.include_router(conversation_router)
app.include_router(knowledge_router)
app.include_router(auth_router)
app.include_router(settings_router)
app.include_router(user_router)
app.include_router(email_router)
app.include_router(report_router)
app.include_router(meeting_router)
app.include_router(customer_support_router)
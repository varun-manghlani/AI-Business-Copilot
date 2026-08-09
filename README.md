# AI Business Copilot

AI Business Copilot is an AI-powered business productivity assistant designed to help employees and administrators with everyday business tasks such as AI conversations, email generation, report generation, meeting summarization, document-based question answering, and voice interaction.

The application uses a locally running LLM through Ollama and provides a modern web-based interface with role-based access control.

---

## 🚀 Features

### 💬 AI Chat

- Conversational AI interface
- Persistent conversations
- Conversation history
- New chat creation
- Delete conversations
- Streaming AI responses
- Local LLM inference using Ollama

### ✉️ Email Generator

Generate professional business emails using AI.

- Recipient
- Subject
- Purpose
- Tone selection
- AI-generated email content

### 📊 Report Generator

Generate structured business reports using AI.

### 📝 Meeting Summarizer

Convert meeting notes into concise summaries using AI.

### 🎙️ AI Voice Assistant

Interact with the AI Business Copilot using voice commands.

The voice assistant can:

- Understand voice commands
- Navigate between application pages
- Trigger AI tools
- Generate results using voice commands
- Display voice transcripts
- Provide processing feedback

### 📚 Knowledge Base

Admin users can work with the business knowledge base and use company documents for AI-powered responses.

The system supports Retrieval-Augmented Generation (RAG) for retrieving relevant information from business documents.

### 📈 Dashboard

Each user has a personalized dashboard containing:

- AI chat count
- Emails generated
- Reports generated
- Meetings summarized
- Recent activity
- Recent conversations
- Quick actions
- Personal AI usage statistics

Dashboard statistics are associated with the currently authenticated user.

### 👥 Role-Based Access

The application supports different user roles.

#### Administrator

Administrators can access:

- Dashboard
- AI Chat
- Email Generator
- Report Generator
- Meeting Summarizer
- Knowledge Base
- Analytics
- Settings
- User Management

#### Employee

Employees can access:

- Dashboard
- AI Chat
- Email Generator
- Report Generator
- Meeting Summarizer
- Personal Settings

Employees cannot access:

- Analytics
- Knowledge Base
- User Management

Role restrictions are enforced in the application and protected API endpoints.

### 🔐 Authentication

- User login
- JWT authentication
- Protected routes
- Current-user authentication
- Forgot password
- Password reset
- Role-based authorization
- Logout

### 🗄️ Conversation & Usage Data

The application stores:

- User accounts
- Conversations
- Conversation messages
- AI tool usage
- Dashboard statistics
- Password reset information

The current development database uses SQLite.

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │                     │
                    │  Dashboard          │
                    │  AI Chat            │
                    │  Email Generator    │
                    │  Report Generator   │
                    │  Meeting Summary    │
                    │  Knowledge Base     │
                    │  Settings           │
                    │  Voice Assistant    │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │                     │
                    │ Authentication      │
                    │ Chat                │
                    │ Dashboard           │
                    │ AI Tools            │
                    │ Voice assistant     │
                    │ Knowledge Base      │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
          ollama            SQLIGHT DB        ChromaDB
        local llm                             Vector DB
```

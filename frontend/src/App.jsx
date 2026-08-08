import { useEffect, useState } from "react";
import "./styles/App.css";

import { apiFetch } from "./services/api";

import ChatPage from "./pages/ChatPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";

import EmailGenerator from "./pages/tools/EmailGenerator";
import ReportGenerator from "./pages/tools/ReportGenerator";
import MeetingSummary from "./pages/tools/MeetingSummary";
import CustomerSupport from "./pages/tools/CustomerSupport";

import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";

import VoiceAssistant from "./components/VoiceAssistant";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { usePage } from "./context/PageContext";
import ChatSidebar from "./components/ChatSidebar";
import Sidebar from "./components/Sidebar";

function App() {
  const { activePage, setActivePage } = usePage();

  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const [isStreaming, setIsStreaming] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [authPage, setAuthPage] = useState(() => {
    const path = window.location.pathname;

    if (path === "/forgot-password") {
      return "forgot-password";
    }

    if (path === "/reset-password") {
      return "reset-password";
    }

    return "login";
  });

  /* =========================
     AUTHENTICATION
  ========================= */

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (currentConversationId && !isStreaming) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId, isStreaming]);

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  async function checkAuthentication() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingAuth(false);
      return;
    }

    try {
      const response = await apiFetch("/auth/me");

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setUser(data);

      /*
       * Employee restrictions
       */
      if (
        data.role !== "admin" &&
        (activePage === "knowledge" || activePage === "analytics")
      ) {
        setActivePage("dashboard");
      }

      /*
       * Load user's conversations
       */
      await loadConversations();
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function handleLogin() {
    setActivePage("dashboard");
    await checkAuthentication();
  }

  function handleLogout() {
    localStorage.removeItem("token");

    setUser(null);
    setMessages([]);
    setConversations([]);
    setCurrentConversationId(null);

    window.history.pushState({}, "", "/");

    setAuthPage("login");
  }

  /* =========================
     CONVERSATIONS
  ========================= */

  const loadConversations = async () => {
    const response = await apiFetch("/conversations");

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    const loadedConversations = data.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      threadId: conversation.thread_id,
    }));

    setConversations(loadedConversations);

    if (loadedConversations.length > 0 && currentConversationId === null) {
      setCurrentConversationId(loadedConversations[0].id);
    }
  };

  const loadMessages = async (conversationId) => {
    const response = await apiFetch(`/conversation/${conversationId}/messages`);

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setMessages(data);
  };

  const createNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setActivePage("chat");
  };

  const deleteChat = async (chatId) => {
    const response = await apiFetch(`/conversation/${chatId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Failed to delete conversation");
      return;
    }

    const updatedConversations = conversations.filter(
      (conversation) => conversation.id !== chatId,
    );

    setConversations(updatedConversations);

    if (currentConversationId === chatId) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id);
      } else {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
  };

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
    };

    const currentMessage = input;

    let conversationId = currentConversationId;

    let conversation = conversations.find(
      (conversation) => conversation.id === conversationId,
    );

    /*
     * Create conversation only when
     * the first message is sent.
     */
    if (!conversation) {
      const response = await apiFetch("/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Chat",
        }),
      });

      conversation = await response.json();

      conversationId = conversation.id;

      setCurrentConversationId(conversation.id);

      /*
       * Generate AI title
       */
      await apiFetch(`/conversation/${conversation.id}/title`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentMessage,
        }),
      });

      await loadConversations();

      conversation = conversations.find((c) => c.id === conversationId) ?? {
        ...conversation,
        threadId: conversation.thread_id,
      };
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: "assistant",
        content: "",
      },
    ]);

    setInput("");

    try {
      setIsStreaming(true);

      const response = await apiFetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          thread_id: conversation.threadId,
          conversation_id: conversation.id,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value);

        setMessages((prev) => {
          const updatedMessages = [...prev];

          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content:
              updatedMessages[updatedMessages.length - 1].content + chunk,
          };

          return updatedMessages;
        });
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Error connecting to backend",
        },
      ]);

      setIsStreaming(false);
    }
  };

  /* =========================
     AUTH LOADING
  ========================= */

  if (loadingAuth) {
    return <div>Loading...</div>;
  }

  /* =========================
     LOGIN / FORGOT / RESET
  ========================= */

  if (!user) {
    if (authPage === "forgot-password") {
      return (
        <ForgotPassword
          onBackToLogin={() => {
            window.history.pushState({}, "", "/");

            setAuthPage("login");
          }}
        />
      );
    }

    if (authPage === "reset-password") {
      return (
        <ResetPassword
          onBackToLogin={() => {
            window.history.pushState({}, "", "/");

            setAuthPage("login");
          }}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={() => {
          window.history.pushState({}, "", "/forgot-password");

          setAuthPage("forgot-password");
        }}
      />
    );
  }

  /* =========================
     MAIN APPLICATION
  ========================= */

  return (
    <div className="app">
      {activePage === "chat" ? (
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          createNewChat={createNewChat}
          deleteChat={deleteChat}
          setCurrentConversationId={setCurrentConversationId}
          user={user}
        />
      ) : (
        <Sidebar user={user} setUser={setUser} />
      )}

      <div className="main">
        {activePage === "dashboard" && (
          <Dashboard
            user={user}
            onNavigate={setActivePage}
            conversations={conversations}
            setCurrentConversationId={setCurrentConversationId}
          />
        )}

        {activePage === "chat" && (
          <ChatPage
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "knowledge" && user.role === "admin" && (
          <KnowledgeBase />
        )}

        {activePage === "settings" && <Settings user={user} />}

        {activePage === "analytics" && user.role === "admin" && <Analytics />}

        {activePage === "email-generator" && (
          <EmailGenerator setActivePage={setActivePage} />
        )}

        {activePage === "report-generator" && (
          <ReportGenerator setActivePage={setActivePage} />
        )}

        {activePage === "meeting-summary" && (
          <MeetingSummary setActivePage={setActivePage} />
        )}

        {activePage === "customer-support" && (
          <CustomerSupport setActivePage={setActivePage} />
        )}
      </div>

      <VoiceAssistant user={user} />
    </div>
  );
}

export default App;

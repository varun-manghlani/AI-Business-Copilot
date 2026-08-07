import { useEffect, useState } from "react";
import "./styles/App.css";
import { apiFetch } from "./services/api";
import Sidebar from "./components/Sidebar";
import ChatPage from "./pages/ChatPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import Settings from "./pages/Settings";
import logo from "./assets/logo.png";
import LoginPage from "./pages/LoginPage";
import EmailGenerator from "./pages/tools/EmailGenerator";
import ReportGenerator from "./pages/tools/ReportGenerator";
import MeetingSummary from "./pages/tools/MeetingSummary";
import CustomerSupport from "./pages/tools/CustomerSupport";
import Analytics from "./pages/Analytics";
import VoiceAssistant from "./components/VoiceAssistant";
import { usePage } from "./context/PageContext";

function App() {
  const { activePage, setActivePage } = usePage();
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

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

      if (
        data.role !== "admin" &&
        (activePage === "knowledge" ||
          activePage === "settings" ||
          activePage === "analytics")
      ) {
        setActivePage("chat");
      }

      await loadConversations();
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoadingAuth(false);
    }
  }

  const loadConversations = async () => {
    const response = await apiFetch("/conversations");

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

  async function handleLogin() {
    await checkAuthentication();
  }
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const currentMessage = input;

    const chatTitle =
      currentMessage.length > 40
        ? currentMessage.substring(0, 40) + "..."
        : currentMessage;

    let conversationId = currentConversationId;

    let conversation = conversations.find(
      (conversation) => conversation.id === conversationId,
    );

    // Create conversation only when the first message is sent
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

      // Generate AI title
      await apiFetch(`/conversation/${conversation.id}/title`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentMessage,
        }),
      });

      // Reload conversations so the new AI-generated title appears
      await loadConversations();

      // Get the updated conversation after reload
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
          thread_id: conversation.thread_id,
          conversation_id: conversation.id,
        }),
      });

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

  if (loadingAuth) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        setCurrentConversationId={setCurrentConversationId}
        user={user}
        setUser={setUser}
      />

      <div className="main">
        {activePage === "chat" && (
          <ChatPage
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "knowledge" && <KnowledgeBase />}

        {activePage === "settings" && <Settings />}

        {activePage === "analytics" && <Analytics />}

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

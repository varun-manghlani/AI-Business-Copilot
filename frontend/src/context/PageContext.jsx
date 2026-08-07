import { createContext, useContext, useState } from "react";

const PageContext = createContext();

export function PageProvider({ children }) {
  const [activePage, setActivePage] = useState(
    localStorage.getItem("activePage") || "chat",
  );

  // Stores AI-generated result (email, report, meeting, etc.)
  const [voiceResult, setVoiceResult] = useState(null);

  return (
    <PageContext.Provider
      value={{
        activePage,
        setActivePage,
        voiceResult,
        setVoiceResult,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  return useContext(PageContext);
}

function processVoiceCommand(transcript) {
  const text = transcript.toLowerCase().trim();

  if (text.includes("open analytics") || text.includes("analytics")) {
    return {
      action: "navigate",
      page: "analytics",
    };
  }

  if (text.includes("open chat") || text.includes("chat")) {
    return {
      action: "navigate",
      page: "chat",
    };
  }

  if (text.includes("settings")) {
    return {
      action: "navigate",
      page: "settings",
    };
  }

  if (text.includes("knowledge")) {
    return {
      action: "navigate",
      page: "knowledge",
    };
  }

  return {
    action: "unknown",
  };
}

export default processVoiceCommand;

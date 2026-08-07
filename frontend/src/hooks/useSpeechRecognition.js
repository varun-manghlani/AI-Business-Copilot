import { useRef, useState } from "react";

function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);
    };

    recognitionRef.current = recognition;

    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  return {
    transcript,
    listening,
    startListening,
    stopListening,
  };
}

export default useSpeechRecognition;

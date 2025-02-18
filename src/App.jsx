/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import Header from "./components/Header";
import InputText from "./components/InputText";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAIInitialized, setIsAIInitialized] = useState(false);

  // Initialize AI services
  useEffect(() => {
    const initializeAI = async () => {
      if (!window.ai) {
        setError("AI services not available. Please check your setup.");
        return;
      }

      try {
        // Initialize language detector
        if (!import.meta.env.VITE_LANGUAGE_DETECTOR_TOKEN) {
          throw new Error("Language detector token is missing");
        }
        await window.ai.languageDetector.init({
          token: import.meta.env.VITE_LANGUAGE_DETECTOR_TOKEN,
        });

        // Initialize translator
        if (!import.meta.env.VITE_TRANSLATOR_TOKEN) {
          throw new Error("Translator token is missing");
        }
        await window.ai.translator.init({
          token: import.meta.env.VITE_TRANSLATOR_TOKEN,
        });

        setIsAIInitialized(true);
      } catch (err) {
        setError(`Failed to initialize AI services: ${err.message}`);
        console.error("AI initialization error:", err);
      }
    };

    initializeAI();
  }, []);

  const detectLanguage = async (text) => {
    if (!isAIInitialized) {
      throw new Error("AI services not initialized");
    }

    try {
      const detector = await window.ai.languageDetector.create();
      const results = await detector.detect(text);
      if (!results || !results[0]) {
        throw new Error("No language detected");
      }
      return results[0].detectedLanguage;
    } catch (error) {
      console.error("Language detection error:", error);
      throw new Error("Language detection failed: " + error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text");
      return;
    }

    if (!isAIInitialized) {
      setError("AI services not initialized. Please wait or refresh the page.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const detectedLanguage = await detectLanguage(inputText);

      const newMessage = {
        id: Date.now(),
        text: inputText,
        language: detectedLanguage,
        processed: [],
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (messageId) => {
    if (!isAIInitialized) {
      setError("AI services not initialized. Please wait or refresh the page.");
      return;
    }

    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    setIsLoading(true);
    setError("");

    try {
      const translator = await window.ai.translator.create({
        sourceLanguage: message.language,
        targetLanguage: selectedLanguage,
      });

      const translation = await translator.translate(message.text);
      if (!translation) {
        throw new Error("Translation failed - no result received");
      }

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            return {
              ...m,
              processed: [
                ...m.processed,
                {
                  type: "translation",
                  content: translation,
                  targetLanguage: selectedLanguage,
                },
              ],
            };
          }
          return m;
        })
      );
    } catch (err) {
      console.error("Translation error:", err);
      setError("Translation failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } dark:bg-dark-backgroundDark bg-light-backgroundLight min-h-screen flex flex-col`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 overflow-hidden mt-16 mb-20">
        <div className="h-full max-w-3xl mx-auto">
          <ChatBox
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            onTranslate={handleTranslate}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </main>
      {messages.length > 0 && (
        <InputText
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}

export default App;

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

  useEffect(() => {
    const checkAIAvailability = async () => {
      if (!self.ai) {
        setError("Please use Chrome or Edge browser");
        return;
      }
      setIsAIInitialized(true);
    };

    checkAIAvailability();
  }, []);

  const detectLanguage = async (text) => {
    try {
      const detector = await window.ai.languageDetector.create();
      const results = await detector.detect(text);
      console.log(results);
      if (!results || !results[0]) return null;
      return results[0].detectedLanguage;
    } catch (error) {
      console.error("Language detection error:", error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isAIInitialized) return;

    setIsLoading(true);
    setError("");

    try {
      const detectedLanguage = await detectLanguage(inputText);
      if (!detectedLanguage) {
        setError("Could not detect language");
        return;
      }

      const newMessage = {
        id: Date.now(),
        text: inputText,
        language: detectedLanguage,
        processed: [],
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
    } catch (err) {
      setError("Failed to process message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (messageId) => {
    if (!isAIInitialized) return;

    const message = messages.find((m) => m.id === messageId);
    if (!message || message.language === selectedLanguage) return;

    setIsLoading(true);
    setError("");

    try {
      const translator = await self.ai.translator.create({
        sourceLanguage: message.language,
        targetLanguage: selectedLanguage,
      });

      const translation = await translator.translate(message.text);
      if (!translation) return;

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            // Check for existing translation
            const hasTranslation = m.processed.some(
              (p) =>
                p.type === "translation" &&
                p.targetLanguage === selectedLanguage
            );
            if (hasTranslation) return m;

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
      setError("Translation failed");
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

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
  const [isSummarizerAvailable, setIsSummarizerAvailable] = useState(false);

  useEffect(() => {
    const checkAIAvailability = async () => {
      if (!self.ai) {
        setError("Please use Chrome or Edge browser");
        return;
      }

      // Check summarizer availability
      if ("ai" in self && "summarizer" in self.ai) {
        try {
          const summarizerCapabilities =
            await self.ai.summarizer.capabilities();
          console.log("Summarizer capabilities:", summarizerCapabilities);

          if (summarizerCapabilities.available === "readily") {
            setIsSummarizerAvailable(true);
            console.log("Summarizer is readily available");
          } else if (summarizerCapabilities.available === "after-download") {
            setIsSummarizerAvailable(true);
            console.log("Summarizer will be available after download");
          } else {
            console.log(
              "Summarizer is not available:",
              summarizerCapabilities.available
            );
            setIsSummarizerAvailable(false);
          }
        } catch (err) {
          console.error("Error checking summarizer availability:", err);
          setIsSummarizerAvailable(false);
        }
      } else {
        console.log("Summarizer API not found in browser");
        setIsSummarizerAvailable(false);
      }

      setIsAIInitialized(true);
    };

    checkAIAvailability();
  }, []);

  const detectLanguage = async (text) => {
    try {
      const detector = await window.ai.languageDetector.create();
      const results = await detector.detect(text);
      console.log("Language detection results:", results);
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

    if (!("ai" in self && "translator" in self.ai)) {
      setError("Translation API not supported in this browser");
      return;
    }

    const message = messages.find((m) => m.id === messageId);
    if (!message || message.language === selectedLanguage) return;

    setIsLoading(true);
    setError("");

    try {
      console.log(
        `Attempting translation from ${message.language} to ${selectedLanguage}`
      );

      const translatorCapabilities = await self.ai.translator.capabilities();
      const availability = await translatorCapabilities.languagePairAvailable(
        message.language,
        selectedLanguage
      );

      if (availability === "no") {
        setError(
          `Translation not available for ${message.language} to ${selectedLanguage}`
        );
        return;
      }

      const translator = await self.ai.translator.create({
        sourceLanguage: message.language,
        targetLanguage: selectedLanguage,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(
              `Downloading language pack: ${Math.round(
                (e.loaded / e.total) * 100
              )}%`
            );
          });
        },
      });

      const translation = await translator.translate(message.text);
      console.log("Translation result:", translation);
      if (!translation) return;

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
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
      console.error("Translation error details:", err);
      setError(`Translation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async (messageId) => {
    if (!isAIInitialized) {
      console.log("AI not initialized");
      return;
    }

    if (!isSummarizerAvailable) {
      setError("Summarizer is not available in your browser");
      console.log("Summarizer not available");
      return;
    }

    const message = messages.find((m) => m.id === messageId);
    if (!message) {
      console.log("Message not found:", messageId);
      return;
    }

    // Only summarize if text is more than 150 words
    const wordCount = message.text.trim().split(/\s+/).length;
    if (wordCount <= 150) {
      console.log("Text too short for summary:", wordCount, "words");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Creating summarizer...");
      const summarizer = await self.ai.summarizer.create({
        type: "key-points",
        format: "markdown",
        length: "medium",
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(
              `Downloading summarizer model: ${Math.round(
                (e.loaded / e.total) * 100
              )}%`
            );
          });
        },
      });

      console.log("Generating summary...");
      const summary = await summarizer.summarize(message.text);
      console.log("Summary generated:", summary);

      if (!summary) {
        throw new Error("No summary was generated");
      }

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const hasSummary = m.processed.some((p) => p.type === "summary");
            if (hasSummary) return m;

            return {
              ...m,
              processed: [
                ...m.processed,
                {
                  type: "summary",
                  content: summary,
                },
              ],
            };
          }
          return m;
        })
      );
    } catch (err) {
      console.error("Summarization error:", err);
      setError(`Summarization failed: ${err.message}`);
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
            onSummarize={handleSummarize}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            isLoading={isLoading}
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

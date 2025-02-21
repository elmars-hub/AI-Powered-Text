/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  checkBrowserSupport,
  checkSummarizerAvailability,
} from "../utils/apiInitialization";
import { detectLanguage, translateText } from "../utils/translation";
import { checkTextLength, summarizeText } from "../utils/summarization";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Message and input state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Status and loading state
  const [error, setError] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [downloadProgress, setDownloadProgress] = useState(null);

  // Initialize API on mount
  useEffect(() => {
    const initializeAPI = async () => {
      const browserSupport = checkBrowserSupport();
      if (!browserSupport.isSupported) {
        setError(browserSupport.error);
        setApiStatus("unsupported");
        return;
      }

      const summarizerStatus = await checkSummarizerAvailability();
      setApiStatus(summarizerStatus.available);
      if (summarizerStatus.error) {
        setError(summarizerStatus.error);
      }
    };

    initializeAPI();
  }, []);

  // Handle theme toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

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
    }
  };

  const handleTranslate = async (messageId) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.language === selectedLanguage) return;

    setIsTranslating(true);
    setError("");

    const onProgress = (loaded, total, percentage) => {
      setDownloadProgress({ loaded, total, percentage });
    };

    const result = await translateText(
      message.text,
      message.language,
      selectedLanguage,
      onProgress
    );

    if (result.success) {
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
                  content: result.translation,
                  targetLanguage: selectedLanguage,
                },
              ],
            };
          }
          return m;
        })
      );
    } else {
      setError(result.error);
    }

    setIsTranslating(false);
    setDownloadProgress(null);
  };

  const handleSummarize = async (messageId) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    if (!checkTextLength(message.text)) {
      setError(
        "Text is too short for summarization (minimum 150 words required)"
      );
      return;
    }

    setIsSummarizing(true);
    setError("");

    const onProgress = (loaded, total, percentage) => {
      setDownloadProgress({ loaded, total, percentage });
    };

    const result = await summarizeText(message.text, onProgress);

    if (result.success) {
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
                  content: result.summary,
                },
              ],
            };
          }
          return m;
        })
      );
    } else {
      setError(result.error);
    }

    setIsSummarizing(false);
    setDownloadProgress(null);
  };

  // Languages configuration
  const languages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Portuguese" },
    { code: "es", name: "Spanish" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
    { code: "fr", name: "French" },
  ];

  const getLanguageName = (code) => {
    const languageMap = {
      en: "English",
      pt: "Portuguese",
      es: "Spanish",
      ru: "Russian",
      tr: "Turkish",
      fr: "French",
    };
    return languageMap[code] || code;
  };

  const clearChat = () => {
    setMessages([]);
    setInputText("");
    setError("");
  };

  const contextValue = {
    // Theme
    darkMode,
    toggleDarkMode,

    // Messages and input
    messages,
    setMessages,
    inputText,
    setInputText,

    // Language
    selectedLanguage,
    setSelectedLanguage,
    languages,
    getLanguageName,

    // Status and loading
    error,
    setError,
    isTranslating,
    isSummarizing,
    apiStatus,
    downloadProgress,

    // Message handlers
    handleSendMessage,
    handleTranslate,
    handleSummarize,
    clearChat,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

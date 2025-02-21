import { useEffect, useRef } from "react";
import { IoSendOutline, IoTrashOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";

function ChatBox() {
  const {
    messages,
    inputText,
    setInputText,
    handleSendMessage,
    handleTranslate,
    handleSummarize,
    selectedLanguage,
    setSelectedLanguage,
    languages,
    getLanguageName,
    isTranslating,
    isSummarizing,
    apiStatus,
    clearChat,
  } = useAppContext();

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const processedMessagesCount = messages.reduce(
    (sum, m) => sum + m.processed.length,
    0
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, processedMessagesCount]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6" ref={chatContainerRef}>
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-8 px-4">
          <div className="text-center mt-16">
            <h1 className="text-2xl font-bold dark:text-gray-200 text-gray-700 mb-4">
              How can I help you today?
            </h1>
            <p className="text-xl dark:text-gray-300 text-gray-600 mb-2">
              Type any text to detect its language and translate it
            </p>
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Best experienced on desktop Chrome or Edge browsers
            </p>
          </div>
          <div className="w-full max-w-2xl flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoSendOutline />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
            >
              <IoTrashOutline className="text-lg" />
              <span>Clear Chat</span>
            </button>
          </div>
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col space-y-2">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-blue-500 text-white px-4 py-2 rounded-lg">
                  {message.text}
                </div>
              </div>
              <div className="flex items-center gap-4 ml-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Detected: {getLanguageName(message.language)}
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="text-sm px-2 py-1 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      disabled={lang.code === message.language}
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleTranslate(message.id)}
                  disabled={
                    selectedLanguage === message.language ||
                    isTranslating ||
                    apiStatus === "checking"
                  }
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isTranslating ? (
                    <>
                      <LoadingSpinner />
                      <span>Translating...</span>
                    </>
                  ) : (
                    "Translate"
                  )}
                </button>
                {getWordCount(message.text) > 150 && (
                  <button
                    onClick={() => handleSummarize(message.id)}
                    disabled={
                      isSummarizing ||
                      apiStatus === "no" ||
                      apiStatus === "unsupported" ||
                      apiStatus === "error" ||
                      apiStatus === "checking"
                    }
                    className="text-sm text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isSummarizing ? (
                      <>
                        <LoadingSpinner />
                        <span>Summarizing...</span>
                      </>
                    ) : (
                      "Summarize"
                    )}
                  </button>
                )}
              </div>
              {message.processed.map((proc, index) => {
                if (proc.type === "translation") {
                  return (
                    <div key={index} className="flex flex-col ml-8 mt-2">
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                          {proc.content}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 mt-1">
                        Translated to: {getLanguageName(proc.targetLanguage)}
                      </span>
                    </div>
                  );
                } else if (proc.type === "summary") {
                  return (
                    <div key={index} className="flex flex-col ml-8 mt-2">
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                          <div className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                            Summary:
                          </div>
                          {proc.content}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

export default ChatBox;

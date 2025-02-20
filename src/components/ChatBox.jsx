/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { IoSendOutline } from "react-icons/io5";

function ChatBox({
  messages,
  inputText,
  setInputText,
  onSendMessage,
  onTranslate,
  onSummarize,
  selectedLanguage,
  setSelectedLanguage,
  isLoading,
}) {
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
      onSendMessage(inputText);
    }
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Portuguese" },
    { code: "es", name: "Spanish" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
    { code: "fr", name: "French" },
  ];

  const getLanguageName = (code) => {
    const languages = {
      en: "English",
      pt: "Portuguese",
      es: "Spanish",
      ru: "Russian",
      tr: "Turkish",
      fr: "French",
    };
    return languages[code] || code;
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
              onClick={() => onSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoSendOutline />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
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
                  onClick={() => onTranslate(message.id)}
                  disabled={selectedLanguage === message.language}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Translate
                </button>
                {getWordCount(message.text) > 150 && (
                  <button
                    onClick={() => onSummarize(message.id)}
                    disabled={isLoading}
                    className="text-sm text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
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

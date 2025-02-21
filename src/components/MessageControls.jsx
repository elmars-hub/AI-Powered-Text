/* eslint-disable react/prop-types */
import LoadingSpinner from "./LoadingSpinner";
import { useAppContext } from "../context/AppContext";

function MessageControls({ message }) {
  const {
    selectedLanguage,
    setSelectedLanguage,
    languages,
    getLanguageName,
    handleTranslate,
    handleSummarize,
    isTranslating,
    isSummarizing,
    apiStatus,
  } = useAppContext();

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div
      className="flex items-center gap-4 ml-2 flex-wrap"
      role="group"
      aria-label="Message controls"
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
        Detected: {getLanguageName(message.language)}
      </span>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="text-sm px-3 py-1 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow hover:shadow-md"
        aria-label="Select translation language"
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
        className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full transition-all hover:shadow-md"
        aria-label={isTranslating ? "Translating..." : "Translate message"}
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
      {getWordCount(message.text) > 150 && message.language === "en" && (
        <button
          onClick={() => handleSummarize(message.id)}
          disabled={
            isSummarizing ||
            apiStatus === "no" ||
            apiStatus === "unsupported" ||
            apiStatus === "error" ||
            apiStatus === "checking"
          }
          className="text-sm text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full transition-all hover:shadow-md"
          aria-label={isSummarizing ? "Summarizing..." : "Summarize message"}
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
  );
}

export default MessageControls;

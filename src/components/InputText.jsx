import { IoSendOutline, IoTrashOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";

function InputText() {
  const {
    inputText,
    setInputText,
    handleSendMessage,
    isTranslating,
    isSummarizing,
    apiStatus,
    clearChat,
  } = useAppContext();

  const isLoading = isTranslating || isSummarizing || apiStatus === "checking";

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-2 sm:p-4 z-10 dark:bg-dark-backgroundDark bg-light-primaryLight backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
      role="form"
      aria-label="Message input form"
    >
      <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-4 px-2 sm:px-0">
        <button
          onClick={clearChat}
          className="p-2 sm:px-4 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
          title="Clear chat"
          aria-label="Clear chat history"
        >
          <IoTrashOutline className="text-lg sm:text-xl" aria-hidden="true" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Type your message here..."
            className="w-full px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-shadow hover:shadow-md text-sm sm:text-base"
            aria-label="Message input"
            role="textbox"
            aria-disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          className="p-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 min-w-[40px] sm:min-w-[64px]"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="status"
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
          ) : (
            <IoSendOutline className="text-lg sm:text-xl" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export default InputText;

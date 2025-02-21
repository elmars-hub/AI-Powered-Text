import { IoSendOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";

function EmptyChat() {
  const { inputText, setInputText, handleSendMessage } = useAppContext();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 px-4" role="status" aria-label="Empty chat">
      <div className="text-center mt-16">
        <h1 className="text-2xl font-bold dark:text-gray-200 text-gray-700 mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
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
  );
}

export default EmptyChat; 
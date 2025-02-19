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
  // ... existing code ...
  return (
    <button
      onClick={() => onTranslate(message.id)}
      disabled={selectedLanguage === message.language}
      className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Translate
    </button>
  );
}

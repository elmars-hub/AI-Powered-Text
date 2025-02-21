import { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import EmptyChat from "./EmptyChat";
import MessageControls from "./MessageControls";
import ProcessedContent from "./ProcessedContent";

function ChatBox() {
  const { messages } = useAppContext();

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

  return (
    <div className="h-full overflow-y-auto px-4 py-6" ref={chatContainerRef}>
      {messages.length === 0 ? (
        <EmptyChat />
      ) : (
        <div className="space-y-6" role="log" aria-label="Chat messages">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col space-y-3 animate-fade-in" role="article">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  {message.text}
                </div>
              </div>
              <MessageControls message={message} />
              <ProcessedContent processed={message.processed} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

export default ChatBox;

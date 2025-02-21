import ChatBox from "./components/ChatBox";
import Header from "./components/Header";
import InputText from "./components/InputText";
import { useAppContext } from "./context/AppContext";

function App() {
  const { darkMode, messages, error } = useAppContext();

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen flex flex-col transition-theme duration-300 ease-theme animate-theme-fade`}
    >
      <div className="dark:bg-dark-backgroundDark bg-light-primaryLight min-h-screen flex flex-col transition-theme duration-300 ease-theme">
        <Header />
        <main className="flex-1 overflow-hidden mt-16 mb-20">
          <div className="h-full max-w-3xl mx-auto">
            <ChatBox />
          </div>
        </main>
        {messages.length > 0 && <InputText />}
        {error && (
          <div className="fixed bottom-24 left-0 right-0 flex justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg animate-fade-in">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

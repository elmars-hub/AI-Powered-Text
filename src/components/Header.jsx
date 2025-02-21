import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";
import Logo from "/translate.png";

function Header() {
  const { darkMode, toggleDarkMode } = useAppContext();

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-10 dark:bg-dark-backgroundDark bg-light-primaryLight shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <nav className="max-w-7xl mx-auto flex justify-between items-center h-full px-6">
        <div className="flex items-center space-x-3 transition-transform hover:scale-105">
          <img src={Logo} alt="logo" className="h-10 w-10 rounded-lg shadow-md" />
          <h2 className="dark:text-stone-300 font-bold text-3xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">ChatHNG</h2>
        </div>

        <button
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-secondaryContainer transition-all duration-300 transform hover:scale-110"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="text-xl dark:text-stone-100">
            {darkMode ? (
              <IoSunnyOutline className="animate-rotate-light" />
            ) : (
              <IoMoonOutline className="animate-rotate-dark rotate-45" />
            )}
          </span>
        </button>
      </nav>
    </div>
  );
}

export default Header;

import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";

function Header() {
  const { darkMode, toggleDarkMode } = useAppContext();

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-10 dark:bg-dark-backgroundDark bg-light-primaryLight shadow-md">
      <nav className="flex justify-between items-center px-6 py-2">
        <h2 className="dark:text-stone-300 font-bold text-3xl">ChatHNG</h2>

        <button
          className="p-3 rounded-full hover:dark:bg-outlineDark cursor-pointer"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="text-base dark:text-stone-100 transition-all duration-300">
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

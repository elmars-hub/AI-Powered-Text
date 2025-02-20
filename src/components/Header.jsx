/* eslint-disable react/prop-types */
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

function Header({ darkMode, setDarkMode }) {
  function handleMode() {
    setDarkMode((d) => !d);
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-10 dark:bg-dark-backgroundDark bg-light-backgroundLight">
      <nav className="flex justify-between items-center px-6 py-2">
        <h2 className="dark:text-stone-300 font-bold text-3xl">ChatHNG</h2>

        <div
          className="p-3 rounded-full hover:dark:bg-outlineDark cursor-pointer"
          onClick={handleMode}
        >
          <span className="text-2xl dark:text-stone-100">
            {darkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Header;

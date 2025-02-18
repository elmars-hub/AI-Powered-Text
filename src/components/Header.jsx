/* eslint-disable react/prop-types */
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

function Header({ darkMode, setDarkMode }) {
  function handleMode() {
    setDarkMode((d) => !d);
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-10 bg-dark-backgroundDark">
      <nav className="flex justify-between items-center px-6 py-2">
        <h2 className="text-stone-300 font-bold text-3xl">ChatAI</h2>

        <div
          className="p-3 rounded-lg bg-light-primaryLight cursor-pointer"
          onClick={handleMode}
        >
          <span className="text-2xl">
            {darkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Header;

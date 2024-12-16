import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(ChatContext);
  const logoutHandler = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };
  // Ensure hooks run before any conditional return
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return <div>Loading...</div>; // This can safely be here now
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md">
        <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap ml-10 items-center justify-between mx-auto max-w-screen-xl">
            {/* Logo */}
            <a href="https://flowbite.com" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-8 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                PingMe
              </span>
            </a>
            {/* Dropdown and user profile */}
            <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
              <li ref={menuRef}>
                <button
                  onClick={() => setMenu((prev) => !prev)}
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  {/* Icon */}
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                  >
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {menu && (
                  <div className="absolute z-10 mt-6 grid w-auto text-md bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-3 dark:bg-gray-700">
                    <div className="p-2 pb-0 text-gray-900 md:pb-3 dark:text-white">
                      <ul className="space-y-3">
                        <li>
                          <button
                            onClick={logoutHandler}
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-500"
                          >
                            LogOut
                          </button>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-500"
                          >
                            Account
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </li>
              <li>
                <button onClick={() => setModal((prev) => !prev)}>
                  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <img
                      src={user.picture}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <ProfileModal modal={modal} setModal={setModal} user={user} />
    </>
  );
};

export default ChatHeader;

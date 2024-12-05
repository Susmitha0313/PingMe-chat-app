import React, { useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
const SideDrawer = () => {
  const [state, setState] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sidebar, setSidebar] = useState(false);
    // const { user } = useContext(ChatContext);

  const handleSidebar = () => setSidebar(!sidebar);
  const handleSearchChange = (e) => setSearchResult(e.target.value);

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 z-50 ">
        <button
          onClick={handleSidebar}
          className="text-white bg-gray-800 bg-opacity-90 hover:bg-gray-800 hover:bg-opacity-60 font-medium rounded-lg text-sm px-4 py-3 dark:hover:bg-gray-700 dark:hover:bg-opacity-60 focus:outline-none"
          type="button"
          data-drawer-target="drawer-navigation"
          data-drawer-show="drawer-navigation"
          aria-controls="drawer-navigation"
        >
          <svg
            className="w-5 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      <div>
        {sidebar && (
          <div
            id="drawer-navigation"
            className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
              sidebar ? "translate-x-0" : "-translate-x-full"
            } bg-white w-64 dark:bg-gray-800`}
            tabIndex="-1"
            aria-labelledby="drawer-navigation-label"
          >
            <div className="relative mt-12">
              <input
                onChange={handleSearchChange}
                value={searchResult}
                type="search"
                id="default-search"
                className="block w-full p-3 ps-5 text-sm text-gray-900 hover:text-gray-900 dark:hover:text-white border border-gray-300 rounded-md bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                placeholder="Search or start a new chat..."
                required
              />
            </div>

            <div className="py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="ms-3">Dashboard</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;

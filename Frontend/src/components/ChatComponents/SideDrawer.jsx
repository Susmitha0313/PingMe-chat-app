import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

// import { debounce } from 'lodash';

const SideDrawer = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [sidebar, setSidebar] = useState(false);

  const { user, setSelectedChat, chats, setChats, url } = ChatState();
  const drawerRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${url}/api/users`, config);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error Fetching users:",
          error.response?.data || error.message
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSidebar = () => setSidebar(!sidebar);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setSidebar(false);
      }
    };
    if (sidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[sidebar]);

  

  const filteredContacts = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${url}/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoading(false);
      setSidebar(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="fixed mt-3 z-50 ">
        <button
          onClick={handleSidebar}
          className={`text-white bg-blue-600 hover:bg-blue-700  focus:outline-none ${
            sidebar &&
            "focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-800"
          } font-medium 
            rounded-full text-sm p-2.5 inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 `}
        >
          <svg
            className="w-6 mr-2  h-6 text-white-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 22"
          >
            <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
          </svg>
          Search Users
        </button>
      </div>

      <div>
        {sidebar && (
          <>
            {/* Background Blur */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-100"></div>

            <div
              ref={drawerRef}
              className="fixed inset-0 top-0 left-0 z-40 h-screen p-4 w-64 bg-white shadow-lg dark:bg-gray-800"
              // fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50
            >
              {/* Search Input */}
              <div className="relative mt-[59px] pt-3">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={query}
                  onChange={handleSearchChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 
        border-gray-300 bg-gray-100 text-black 
        placeholder-gray-500 focus:ring-blue-400
        dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
                />
              </div>

              <ul className="mt-4 overflow-y-auto thin-scrollbar space-y-3 w-fixed ">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact, index) => (
                    <li
                      key={`${contact._id}-${index}`}
                      onClick={() => accessChat(contact._id)}
                      className="flex items-center cursor-pointer p-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm 
          hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                    >
                      <img
                        src={contact.picture}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div className="cont w-full overflow-hidden">
                        <h3 className="text-md font-semibold text-gray-800 dark:text-white truncate">
                          {contact.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 truncate">
                          {contact.email}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 dark:text-gray-400 text-center p-3">
                    No contacts found
                  </li>
                )}
              </ul>

              {loading && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;

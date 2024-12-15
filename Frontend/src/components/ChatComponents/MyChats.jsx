import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [loggedUser, setLoggerUser] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:8000/api/chat",
          config
        );
        setChats(data);
        setLoggerUser(data);
      } catch (err) {
        setError("Failed to load chats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user]);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const newGroup = () => {
    console.log("createGroup");
  };
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 mt-12 p-4">
      {/* Header */}
      <div className="flex justify-between mt-3 items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Chats
        </h2>
        <div className="flex items-center space-x-2">
          {/* New Group Chat Button */}
          <div className="relative group">
            <button
              onClick={newGroup}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
            rounded-full text-sm p-2.5 inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
              </svg>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              New Group Chat
            </span>
          </div>
        </div>
      </div>

      {/* Chat List or Loading/Error States */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading chats...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : chats.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-300 ${
              selectedChat?._id === chat._id && "bg-gray-200 dark:bg-gray-700"
            }`}
            >
              <div>
                <p className="text-md font-semibold text-gray-800 dark:text-white">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {chat.latestMessage?.content || "No messages yet."}
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(chat.updatedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-center p-3">
          No chats available. Start a new conversation!
        </div>
      )}
    </div>
  );
};

export default MyChats;

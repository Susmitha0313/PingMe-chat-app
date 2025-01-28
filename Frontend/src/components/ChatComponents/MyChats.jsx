import React, { useEffect, useMemo, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import socket from "../../../Utility/socket";


const MyChats = () => {
  const [chats, setChats] = useState([]); // Holds the chats
  const [loggedUser, setLoggerUser] = useState(); // Logged-in user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, selectedChat, setSelectedChat, notification ,url} = ChatState();

  const unreadCounts = useMemo(() => {
    return notification.reduce((acc, msg) => {
      acc[msg.chat._id] = (acc[msg.chat._id] || 0) + 1;
      return acc;
    }, {});
  }, [notification]);

  // Fetch Chats
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
        const { data } = await axios.get(`${url}/api/chat`, config);

        setChats(data);
        setLoggerUser(user);
      } catch (err) {
        setError("Failed to load chats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Listen for "message received"
  useEffect(() => {
    if (!socket) return;

    const updateChatsWithNewMessage = (newMsgReceived) => {
      setChats((prevChats) => {
        const chatExists = prevChats.some(
          (chat) => chat._id === newMsgReceived.chat._id
        );
        if (chatExists) {
          return prevChats.map((chat) =>
            chat._id === newMsgReceived.chat._id
              ? { ...chat, latestMessage: newMsgReceived }
              : chat
          );
        } else {
          return [...prevChats, newMsgReceived.chat];
        }
      });
    };

    socket.on("message received", updateChatsWithNewMessage);

    return () => socket.off("message received", updateChatsWithNewMessage);
  }, []); // Empty dependencies

  

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const newGroup = () => {
    console.log("createGroup");
  };

  return (
    <div className="h-screen mt-[59px] flex flex-col bg-white dark:bg-gray-900  p-4">
      {/* Header */}
      <div className="flex justify-between mt-3 items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Chats
        </h2>
        <div className="flex items-center space-x-2">
          {/* New Group Chat Button */}
          <div className="relative group">
            {/* <button
              onClick={newGroup}
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
            rounded-full text-sm p-2.5 inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-6 h-6 text-white-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                  clipRule="evenodd"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </div>

      {/* Chat List */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading chats...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : chats.length > 0 ? (
        <ul className="mt-4 overflow-y-auto thin-scrollbar space-y-3">
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 
      hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-300 ${
        selectedChat?._id === chat._id && "bg-gray-200 dark:bg-gray-700"
      }`}
            >
              <div className="flex-1">
                <p className="text-md font-semibold text-gray-800 dark:text-white truncate">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px]">
                  {chat.latestMessage?.content || "No messages yet."}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
  {unreadCounts[chat._id] > 0 && (
    <span className="text-xs font-bold text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center">
      {unreadCounts[chat._id] || 0}
    </span>
  )}
  <span className="text-xs text-gray-400 dark:text-gray-500">
    {chat.updatedAt
      ? new Date(chat.updatedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A"}
  </span>
  <span className="text-xs text-gray-400 dark:text-gray-500">
    {chat.updatedAt
      ? new Date(chat.updatedAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : ""}
  </span>
</div>

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

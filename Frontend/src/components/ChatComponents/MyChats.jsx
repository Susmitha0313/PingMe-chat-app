import React, { useEffect, useMemo, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import socket from "../../../Utility/socket";

const MyChats = () => {
  const [chats, setChats] = useState([]); // Holds the chats
  const [loggedUser, setLoggerUser] = useState(); // Logged-in user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({}); // Track unread messages

  const { user, selectedChat, setSelectedChat, notification, url } =
    ChatState();

  // Calculate unread messages for each chat
  const unreadCountsMemo = useMemo(() => {
    return notification.reduce((acc, msg) => {
      acc[msg.chat._id] = (acc[msg.chat._id] || 0) + 1;
      return acc;
    }, {});
  }, [notification]);

  useEffect(() => {
    setUnreadCounts(unreadCountsMemo);
  }, [unreadCountsMemo]);

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
        console.log(data[0].users[0].picture);        
        setLoggerUser(user);
      } catch (err) {
        setError("Failed to load chats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, url]);

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

      // Update unread count
      setUnreadCounts((prev) => ({
        ...prev,
        [newMsgReceived.chat._id]: (prev[newMsgReceived.chat._id] || 0) + 1,
      }));
    };

    socket.on("message received", updateChatsWithNewMessage);
    return () => socket.off("message received", updateChatsWithNewMessage);
  }, [socket]);

  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }));

    try {
      await axios.put(
        `${url}/api/messages/read/${chat._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const getSender = (loggedUser, users) => {
    if (!loggedUser) return "Unknown";
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const newGroup = () => {
    console.log("Create Group");
  };

  return (
    <div className="h-screen mt-[59px] flex flex-col bg-white dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between mt-2 items-center p-4 bg-gray-200 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Chats
        </h2>
        <button
          onClick={newGroup}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Chat List */}
      {loading ? (
        <div className="text-center text-gray-500 bg-gray-800 p-4 dark:text-gray-400">
          Loading chats...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : chats.length > 0 ? (
        <ul className="mt-4 mb-12 overflow-y-auto thin-scrollbar space-y-3">
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-700 
                hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-300 ${
                  selectedChat?._id === chat._id &&
                  "bg-gray-200 dark:bg-gray-700"
                }`}
            >
              {/* Image */}
              <img
                src= {chat.users[0].picture || "/default-avatar.svg"}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />

              {/* Chat Details */}
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold text-gray-800 dark:text-white truncate">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px]">
                  {chat.latestMessage?.content || "No messages yet."}
                </p>
              </div>

              {/* Unread Count */}
              {unreadCounts[chat._id] > 0 && (
                <span className="text-xs font-bold text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center">
                  3{unreadCounts[chat._id]}
                </span>
              )}
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

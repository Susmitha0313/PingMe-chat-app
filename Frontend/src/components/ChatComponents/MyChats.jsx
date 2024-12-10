import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    const fetchChats = async () => {
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
        console.log("chat from myChats ", data);
        setChats(data);
        setLoading(false);
      } catch (error) {
        console.log("Error in loading the chats ", error);
        setLoading(false);
      }
    };
    if (user) fetchChats();
  }, [user]);

  return (
    <div className="h-screen flex flex-col bg-white dark:border-gray-300  mt-12 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Chats
      </h2>
      <div className="space-y-4">
        {selectedChat ? (
          <div>
            {/* Render messages for selected chat */}
            <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
            {/* Example: Add message rendering logic */}
            <ul>
              {selectedChat.messages?.map((msg) => (
                <li key={msg._id}>{msg.text}</li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="mt-4 space-y-3 cursor-pointer">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <li>
                  <div
                    key={chat._id}
                    className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <p>{chat.name}</p>
                      <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                        {chat.updatedAt}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chat.lastMessage}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {chat.time}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-center p-3">
                select a contact to start a conversation
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyChats;

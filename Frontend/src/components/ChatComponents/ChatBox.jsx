import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const ChatBox = () => {
  const { user, selectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState(null);
  const [cocketCncted, setSocketCncted] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketCncted(true));
  }, []);

  const joinRoom = (roomId) => {
    socket.emit("join chat", roomId);

    socket.on("user joined", (room) => {
      console.log(`A user joined room: ${room}`);
    });
  };

  const TypingHandler = (e) => {
    setNewMsg(e.target.value);
    // Optional: Typing indicator logic here
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedChat) return;

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:8000/api/messages/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
        joinRoom(selectedChat._id);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat, user]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:8000/api/messages`,
        { content: newMsg, chatId: selectedChat._id },
        config
      );
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setNewMsg("");
    }
  };

  useEffect(() => {
    socket.on("message received", (newMsgReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsgReceived.chat._id
      ) {
        //give notification
      } else {
        setMessages([...messages, newMsgReceived]);
      }
    });
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 mt-[59px]">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white text-lg font-semibold p-4 shadow flex items-center space-x-4">
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-full">
          <img
            src="src/assets/default-profile-pic.jpg"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          {selectedChat
            ? selectedChat.isGroupChat
              ? selectedChat.chatName
              : selectedChat.users.find((u) => u._id !== user._id)?.name ||
                "Chat Name"
            : "Select a Chat"}
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading messages...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender._id !== user._id && selectedChat.isGroupChat && (
                <img
                  className="w-8 h-8 rounded-full"
                  src={
                    msg.sender.profilePic ||
                    "src/assets/default-profile-pic.jpg"
                  }
                  alt="Sender"
                />
              )}
              <div
                className={`p-3 rounded-lg max-w-md ${
                  msg.sender._id === user._id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none dark:bg-gray-800 dark:text-gray-100"
                }`}
              >
                <div>
                  {selectedChat.isGroupChat && msg.sender._id !== user._id && (
                    <span className="font-semibold">{msg.sender.name}</span>
                  )}
                  <p>{msg.content}</p>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <input
            onChange={TypingHandler}
            onKeyDown={handleKeyPress}
            value={newMsg}
            type="text"
            placeholder="Type your message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
          focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
          text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors 
          dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

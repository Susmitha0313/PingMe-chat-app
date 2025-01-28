import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import socket from "../../../Utility/socket";

const ChatBox = () => {
  const { user, selectedChat, notification, setNotification, url } =
    ChatState();
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const messageEndRef = useRef(null);

  console.log(selectedChat);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Initialize socket and set up listeners
  useEffect(() => {
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => socket.disconnect(); // Cleanup on component unmount
  }, [user]);

  // Join the selected chat's room
  const joinRoom = (roomId) => {
    if (!roomId) return;
    socket.emit("join chat", roomId);
  };

  // Fetch chat messages when a chat is selected
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
          `${url}/api/messages/${selectedChat._id}`,
          config
        );
        setMessages(data);
        joinRoom(selectedChat._id);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    // selectedChatCompare = selectedChat;
  }, [selectedChat, user]);

  // Handle message sending
  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      socket.emit("stop typing", selectedChat._id);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${url}/api/messages`,
        { content: newMsg, chatId: selectedChat._id },
        config
      );
      setMessages((prevMessages) => [...prevMessages, data]);
      socket.emit("new message", data);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setNewMsg("");
    }
  };

  // Receive real-time messages
  useEffect(() => {
    socket.on("message received", (newMsgReceived) => {
      if (!selectedChat || selectedChat._id !== newMsgReceived.chat._id) {
        if (!notification.find((msg) => msg._id === newMsgReceived._id)) {
          setNotification((prev) => [...prev, newMsgReceived]);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMsgReceived]);
      }
      console.log("Notifictn:" + notification);
    });
    return () => {
      socket.off("message received");
    };
  }, [selectedChat, notification, setMessages, setNotification]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing indicator handler
  const TypingHandler = (e) => {
    setNewMsg(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const typingTimeout = 2000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= typingTimeout) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, typingTimeout);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="mt-[59px] bg-blue-600"></div>
      <div className="bg-blue-600 text-white text-lg font-semibold p-4 shadow flex items-center space-x-4">
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-full">
          <img
            src="/default-profile-pic.jpg"
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
      <div
        style={{
          height: "100vh", // Full viewport height
          display: "flex",
          flexDirection: "column",
        }}
        className={`container mx-auto flex-1 overflow-y-auto thin-scrollbar justify-between p-4 
        bg-cover bg-center bg-no-repeat 
        bg-[url('/wpapergray.png')] dark:bg-[url('/3.png')]`}
      >
        {/* Conditional Rendering */}
        {loading ? (
          <div className="text-center text-gray-400 dark:text-white">
            Loading messages...
          </div>
        ) : (
          <div className="flex flex-col flex-grow justify-end space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender._id === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.sender._id !== user._id && selectedChat.isGroupChat && (
                    <img
                      className="w-8 h-8 rounded-full"
                      src={msg.sender.profilePic || "/default-profile-pic.jpg"}
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
                    {selectedChat.isGroupChat &&
                      msg.sender._id !== user._id && (
                        <span className="font-semibold">{msg.sender.name}</span>
                      )}
                    <p>{msg.content}</p>
                    <span className="block text-xs text-slate-300 dark:text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 dark:text-white">
                No messages yet. Start a conversation!
              </div>
            )}
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce dark:bg-blue-300"></div>
            <div
              className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce dark:bg-blue-300"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce dark:bg-blue-300"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Typing...
          </span>
        </div>
      )}

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

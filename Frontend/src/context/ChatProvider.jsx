import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate(); 

  const url = "https://pingme-chat-app.onrender.com" 
  
useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  setUser(userInfo);
  if (!userInfo) {
    navigate("/");
  }
}, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        url
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};



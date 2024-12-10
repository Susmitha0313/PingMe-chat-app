import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate(); // Stable, so fine to include in dependencies

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/"); // Redirect only if userInfo doesn't exist
    }
  }, [navigate]); // Ensure the dependencies include 'user'

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};



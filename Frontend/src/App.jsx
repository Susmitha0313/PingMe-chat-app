import React, { useEffect } from "react";
import {Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ChatsPage from "./pages/ChatsPage";
import socket from "../Utility/socket";
import { ChatState } from "./context/ChatProvider";
function App() {
  const { user } = ChatState();
  useEffect(()=>{
    if (user) {
    socket.emit("setup", user);
    }
  },[user])
  
  return (
    <div
      className="App"
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
  
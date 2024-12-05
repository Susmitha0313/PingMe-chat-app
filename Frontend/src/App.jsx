import React from "react";
import {Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ChatsPage from "./pages/ChatsPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
  
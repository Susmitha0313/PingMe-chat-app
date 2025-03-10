import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import ToastComponent from "../components/ToastComponent";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ChatHeader from "../components/ChatComponents/ChatHeader";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("login");
  const [toast, setToast] = useState({
    message: "",
    type: "",
    showToast: false,   
  });
  const handleToast = ({ message, type }) => {
    setToast({ message, type, showToast: true });
  };
  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, showToast: false }));
  };  

return (
  <>
    <ChatHeader />
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      className={`bg-cover bg-center bg-no-repeat bg-[url('/bearWallpaper.jpeg')] dark:bg-[url('/bearWallpaperDark.jpg')] mx-auto flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 ` } >
      {toast.showToast && (
        <ToastComponent
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={handleToastClose}
        />
      )}

      <h1 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-xl px-7 py-3 text-center shadow-md">
        Welcome to PingMe
      </h1>

      <div className="w-full max-w-md">
        <ul
          className="flex justify-around px-1.5 py-1.5 list-none rounded-md bg-gray-200 dark:bg-gray-800 shadow-sm"
          role="list"
        >
          <li className="flex-auto text-center">
            <button
              onClick={() => setActiveTab("register")}
              className={`flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-md transition-all ease-in-out cursor-pointer
              ${
                activeTab === "register"
                  ? "text-blue-600 bg-white dark:bg-blue-500 dark:text-white shadow-md"
                  : "text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
              role="tab"
              aria-selected={activeTab === "register"}
            >
              Register
            </button>
          </li>

          <li className="flex-auto text-center">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-md transition-all ease-in-out cursor-pointer
              ${
                activeTab === "login"
                  ? "text-blue-600 bg-white dark:bg-blue-500 dark:text-white shadow-md"
                  : "text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
              role="tab"
              aria-selected={activeTab === "login"}
            >
              Login
            </button>
          </li>
        </ul>

        <div className="mt-2 h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md shadow-md">
          {activeTab === "login" && <LoginForm onToast={handleToast} />}
          {activeTab === "register" && <RegisterForm onToast={handleToast} />}
        </div>
      </div>
    </div>
  </>
);

};

export default HomePage;

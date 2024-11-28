import React, { useState, useEffect } from "react";
 
const ToastComponent = ({ message, type = "info", duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose && onClose();
        }, duration);
        
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    
    if (!isVisible) return null;
    
    const toastStyles = {
      info: "bg-blue-500 text-white",
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black",
    };
    
    return (
      <div
        className={`flex items-center w-full max-w-xs p-4 rounded-lg shadow ${toastStyles[type]} fixed top-5 left-1/2 transform -translate-x-1/2`}
        role="alert"
      >
        <div className="flex-1 text-sm font-normal">{message}</div>
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            onClose && onClose(); // Trigger the onClose callback when clicked
          }}
          className="ml-4 p-1.5 bg-transparent text-white rounded-full focus:outline-none"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    ); 
}




export default ToastComponent

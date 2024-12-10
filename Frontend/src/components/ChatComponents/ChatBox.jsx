import React from 'react'

const ChatBox = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 mt-[59px]">
      {/* Chat header */}

      <div className="bg-blue-600 text-white text-lg font-semibold p-4 shadow flex items-center space-x-4">
        <a href="#">
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            {/* {user.pic ? ( */}
              <img
                src="src/assets/default-profile-pic.jpg"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
          </div>
        </a>
        <div>Chating person</div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-4">
        {/* Incoming message */}
        <div className="flex items-start space-x-3">
          <div className="bg-gray-300 text-gray-900 p-3 rounded-lg max-w-md">
            Hello! How are you doing today?
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex items-start justify-end space-x-3">
          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
            I'm good, thanks! How about you?
          </div>
        </div>

        {/* Another incoming message */}
        <div className="flex items-start space-x-3">
          <div className="bg-gray-300 text-gray-900 p-3 rounded-lg max-w-md">
            I'm doing well, thank you!
          </div>
        </div>
      </div>

      {/* Chat input */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox

import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";

import ChatBox from "../components/ChatComponents/ChatBox";
import SideDrawer from "../components/ChatComponents/SideDrawer";
import MyChats from "../components/ChatComponents/MyChats";
import ChatHeader from "../components/ChatComponents/ChatHeader";


const ChatsPage = () => {
const [loading, setLoading] = useState(false);
const { user, selectedChat } = ChatState();

  return (
    <div>
      <ChatHeader />
      <div>
        {user && <SideDrawer />}
        <div className="flex fixed w-full">
          {user && (
            <div className="w-1/2 border-r">
              <MyChats />
            </div>
          )}

          <div className="w-3/4 overflow-y-auto thin-scrollbar">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading chats...
              </div>
            ) : selectedChat ? (
              <ChatBox />
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-500 dark:text-gray-500">
                <img
                  className="w-24 h-24 rounded-full opacity-20"
                  src="/2q6kdOqBAA2cBoLjpv6ASb6bHg8.svg"
                  alt="imggg"
                  // width="384"
                  // height="512"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;

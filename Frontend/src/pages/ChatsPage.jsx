import React, {useContext, useState} from "react";
import { ChatState } from "../context/ChatProvider";


import ChatBox from "../components/ChatComponents/ChatBox";
import SideDrawer from "../components/ChatComponents/SideDrawer";
import MyChats from "../components/ChatComponents/MyChats";
import ChatHeader from "../components/ChatComponents/ChatHeader";



const ChatsPage = () => {
  const { user } = ChatState();
  return (
    <div>
      <ChatHeader />
      <div>
        {user && <SideDrawer />}
        <div className="flex w-full">
          {/* MyChats takes 1/4 of the width */}
          {user && (
            <div className="w-1/2 border-r">
              <MyChats />
            </div>
          )}
          {/* ChatBox takes 3/4 of the width */}
          {user && (
            <div className="w-3/4 overflow-y-auto thin-scrollbar">
              <ChatBox />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;

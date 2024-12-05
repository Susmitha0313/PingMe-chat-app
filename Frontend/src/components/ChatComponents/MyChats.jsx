import React from "react";

const dummyChats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Let’s catch up later!",
    time: "9:15 AM",
  },
  {
    id: 3,
    name: "Alice Johnson",
    lastMessage: "Got it, thanks!",
    time: "Yesterday",
  },
  {
    id: 4,
    name: "Bob Brown",
    lastMessage: "Meeting at 3 PM?",
    time: "Yesterday",
  },
  {
    id: 5,
    name: "Charlie White",
    lastMessage: "See you soon!",
    time: "2 days ago",
  },
];


const MyChats = () => {
  return (
    <div className="h-screen flex flex-col bg-white dark:border-gray-300  mt-12 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Chats
      </h2>
      <div className="space-y-4">
        {dummyChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                {chat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {chat.lastMessage}
              </p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {chat.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyChats;

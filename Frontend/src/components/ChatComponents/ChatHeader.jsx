import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import axios from "axios";

const ChatHeader = () => {
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [profile, setProfile] = useState();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, url } = ChatState();
  
  const logoutHandler = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };
  
  // Ensure hooks run before any conditional return
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log(user);

  useEffect(() => {
    const fetchProfile = async () => {
       if (!user) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const profileData = await axios.get(`${url}/api/users/profile`);
        setProfile(profileData); 
        console.log(profileData);       
      } catch (error) {
        console.log("profile data fetching error :",error)
      }
    }
    fetchProfile();    
  },[])
 
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md">
        <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
          <div className="flex flex-nowrap items-center justify-between mx-auto max-w-screen-xl overflow-x-auto">
            <img
              src="/output-onlinepngtools.png"
              className=" ml-[130px] h-8 sm:h-9"
              alt="PingMe Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              PingMe
            </span>
            {/* Dropdown and user profile */}
            <ul className="flex flex-nowrap items-center font-medium md:space-x-8 mt-0 space-x-4">
             {user && <li ref={menuRef}>
                <button
                  onClick={() => setMenu((prev) => !prev)}
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  {/* Icon */}
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                  >
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                { menu && (
                  <div className="absolute z-10 mt-6 grid w-auto text-md bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-3 dark:bg-gray-700">
                    <div className="p-2 pb-0 text-gray-900 md:pb-3 dark:text-white">
                      <ul className="space-y-3">
                        <li>
                          <button
                            onClick={logoutHandler}
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-500"
                          >
                            LogOut
                          </button>
                        </li>
                      
                      </ul>
                    </div>
                  </div>
                )}
              </li>}

              {profile && (
                <li>
                  <button onClick={() => setModal((prev) => !prev)}>
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <img
                        src={profile.picture}
                        alt="User Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                </li>
              )}
              <li>
                <div className="flex mt-2 items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={toggleTheme}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>{" "}
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {user && (
        <ProfileModal modal={modal} setModal={setModal} user={user} url={url} />
      )}
    </>
  );
};

export default ChatHeader;

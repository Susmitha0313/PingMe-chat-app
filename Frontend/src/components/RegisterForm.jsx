import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const Label = ({ children, isRequired }) => (
  <label className="block dark:text-white text-gray-700 text-sm font-bold mb-2">
    {children}
    {isRequired && <span className="text-red-500 ml-1">*</span>}
  </label>
);
const RegisterForm = ({ onToast }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { url } = ChatState();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword || !phone) {
      onToast({
        message: "Please fill all the fields",
        type: "warning",
        showToast: false,
      });;
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      onToast({
        message: "Password do not match",
        type: "warning",
        duration: 5000,
        showToast: false,
      });
      setLoading(false);
      return;
    }
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(   
      `${url}/api/users`,
      { name, email, password, phone },
      config
    );
    onToast({
      message: "Registration successfull",
      type: "success",
      showToast: false,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
  } catch (error) {
    console.error("Axios Error:", error.response || error.message);
    onToast({
      message: "Error occured",
      type: "error",
      showToast: false,
    });
    setLoading(false);
  }
  };
  return (
    <>
      <form className="w-full bg-white  dark:bg-gray-800 p-6 thin-scrollbar rounded-lg shadow-md overflow-y-auto h-full">
        <div className="fixed bottom-0 left-0 w-full flex flex-col items-center p-4 space-y-2 z-50"></div>
        <div className="mb-6" id="first-name">
          <Label isRequired={true} htmlFor="nickname">
            Nick Name:
          </Label>
          <input
            type="text"
            placeholder="Enter your name"
            required
            className="w-full  px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 "
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6" id="phone-num">
          <Label isRequired={true} htmlFor="phone">
            Phone:
          </Label>
          <input
            type="tel"
            required
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Label isRequired={true} htmlFor="email">
            Email:
          </Label>
          <input
            type="email"
            placeholder="Enter your email Id"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Label isRequired={true} htmlFor="password">
            Password:
          </Label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
            >
              <svg
                className="shrink-0 size-3.5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {showPassword ? (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <Label isRequired={true} htmlFor="confirmPassword">
            Confirm Password:
          </Label>
          <input
            id="hs-toggle-password"
            type="password"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
   
        <button
          onClick={submitHandler}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 "
        >
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;

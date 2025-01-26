import { io } from "socket.io-client";

const ENDPOINT = "https://pingme-chat-app.onrender.com" ; // Your backend URL
const socket = io(ENDPOINT);

export default socket;
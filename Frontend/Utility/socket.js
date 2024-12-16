import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000"; // Your backend URL
const socket = io(ENDPOINT);

export default socket;
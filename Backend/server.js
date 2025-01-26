import express from "express";
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import { Server as SocketServer } from "socket.io";
connectDB();
const port = process.env.PORT || 8000;
const app = express();
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://pingme-ten.vercel.app'], // Whitelisted origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
        credentials: true, // Allow cookies and headers
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

//---------------Deployment-------------    
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "/Frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}
//---------------Deployment-------------

app.use(notFound);
app.use(errorHandler); 



const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
const io = new SocketServer(server, {
    pingTimeout: 60000, //its gonna wait 60 sec before it closes the connection
    cors: {
        origin: ['http://localhost:5173', 'https://pingme-ten.vercel.app'], // Allowed origins
        methods: ['GET', 'POST'],
        credentials: true,
    }
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on('join chat', (room) => {
        socket.join(room);
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newmsgReceived) => {
        try {
            let chat = newmsgReceived.chat;
            if (!chat?.users) throw new Error("chat.users not defined");
            chat.users.forEach((user) => {
                if (user._id === newmsgReceived.sender._id) return;
                socket.in(user._id).emit("message received", newmsgReceived);
            });
        } catch (err) {
            console.error("Error in new message event:", err.message);
        }
    });
    socket.off("setup", () => {
        socket.leave(userData._id);
    })
});
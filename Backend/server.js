import express from "express";
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
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


// let corsMiddleware = function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// }

// app.use(corsMiddleware);

app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        credentials: true, // Allow cookies to be sent
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

//---------------Deployment-------------    

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/Frontend/dist")))
    app.use(express.static(path.join(__dirname1, 'public')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "Frontend", "dist", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}
//---------------Deployment-------------

app.use(notFound);
app.use(errorHandler); 


app.get('/', (req, res) => {
    res.send('Server is ready');
});

const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

const io = new SocketServer(server, {
    pingTimeout: 60000, //its gonna wait 60 sec before it closes the connection
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io");



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
        let chat = newmsgReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach(user => {
            if (user._id == newmsgReceived.sender._id) return;
            socket.in(user._id).emit("message received", newmsgReceived)
        })
    })
    socket.off("setup", () => {
        socket.leave(userData._id);
    })
});
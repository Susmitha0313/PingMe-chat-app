import express from "express";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import cors from "cors"; 
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

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
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());


app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('Server is ready');
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


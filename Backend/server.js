import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import {notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
connectDB();   
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use(notFound);
app.use(errorHandler);

app.get('/',(req,res)=>{res.send('Server is ready')});
app.listen(port, ()=> console.log(`Server running on http://localhost:${port}`));


   
   
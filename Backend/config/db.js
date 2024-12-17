import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("Mongo URI:", process.env.MONGO_URI);

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`ErrorMongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;             
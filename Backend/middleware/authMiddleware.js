import jwt from "jsonwebtoken";  //to get the payload -userId from the token
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

//protect routes so as you are logged in
const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1]; //splits into array and takes the second ..it is body
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorize")
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized. token failed");
    }
}
)
  

export { protect };
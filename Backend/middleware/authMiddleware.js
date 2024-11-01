import jwt from "jsonwebtoken";  //to get the payload -userId from the token
import asyncHandler from "express-async-handler"; 
import User from '../models/userModel.js';

//protect routes so as you are logged in
const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;  //install cookie-parser to make this work
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token');  
        }
    }else{
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});


export {protect};
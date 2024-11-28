import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {expiresIn: "30d"});

    // Set JWT in HTTP-Only cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        withCredentials: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token; // Return the token for inclusion in the response
};

export default generateToken;

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/jwt.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);  // 409 Conflict
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, phone, password });
    if (user) {
        let token = generateToken(res, user._id)
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            picture: user.picture, 
            token,
        });
    } else {   
        res.status(400);
        throw new Error('Failed to create the User');
    }
});


const loginUser = asyncHandler(async (req, res) => {
    console.log("login controller");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        console.log("User found:", user); // Debugging step
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            const token = generateToken(res, user._id);
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                picture: user.picture || "/public/images/default-profile.jpg", // Ensure picture exists
                token,
            });
        } else {
            console.log("Password incorrect for email:", email);
        }
    } else {
        console.log("No user found with email:", email);
    }
    res.status(409);
    throw new Error("Invalid email or password");
});


// api/users?search=susmitha
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);

})

const updateProfilePic = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { picture } = req.body;

    if (!picture) {
        return res.status(400).json({ message: "Profile picture is required." });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { picture },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
            message: "Profile picture updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Error updating profile picture." });
    }
});



const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "User Logged Out" });
});


const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    };
    res.status(200).json(user);
});


const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        })
    } else {
        res.status(404);
        throw new Error('User mot found');
    }
});
export {
    loginUser,
    registerUser,
    allUsers,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateProfilePic,

};
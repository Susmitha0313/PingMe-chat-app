import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

//@sesc   Auth user/set token
//route   POST /api/users/auth
//@access Public //that means you dont need to login to access this page
const authUser = asyncHandler(async(req,res)=>{
    res.status(200).json({message: "Auth user"});
});
//sfdgsjkfbsdf


//@sesc   Register a new user
//route   POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log(name, email, phone);
    const userExists = await User.findOne({ email });
    
    if (userExists) {
        res.status(409);  // 409 Conflict
        throw new Error('User already exists');
    }

    console.log("Registering user");

    const user = await User.create({ name, email, phone, password });
    
    console.log(user);

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
 

//@sesc   Logout user
//route   POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async(req,res)=>{
    res.status(200).json({message: "Logout user"});
});


//@sesc   get user profile
//route   GET /api/users/profile
//@access Private  //as you need to set JWT tokens
const getUserProfile = asyncHandler(async(req,res)=>{
    res.status(200).json({message: "Update User profile"});
});


//@sesc   update user profile
//route   PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async(req,res)=>{
    res.status(200).json({message: "Update User profile"});
});
export {
    authUser,
    registerUser,
    logoutUser, 
    getUserProfile, 
    updateUserProfile
};
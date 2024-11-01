import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/jwt.js";


//@sesc   Auth user/set token
//route   POST /api/users/auth
//@access Public //that means you dont need to login to access this page
const authUser = asyncHandler(async(req,res)=>{
    const {email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            email: user.email,
        })
    }else{
        res.status(409);  // 409 Conflict
        throw new Error('User not found');}
    console.log("Logging in user");
});


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
        generateToken(res, user._id)
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
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: "User Logged Out"});
});


//@sesc   get user profile
//route   GET /api/users/profile
//@access Private  //as you need to set JWT tokens
const getUserProfile = asyncHandler(async(req,res)=>{
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    };
    res.status(200).json(user);
});


//@sesc   update user profile
//route   PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,  
            email: updatedUser.email,
        })
    }else{
        res.status(404);
        throw new Error( 'User mot found');
    }
});
export {
    authUser,
    registerUser,
    logoutUser, 
    getUserProfile, 
    updateUserProfile
};
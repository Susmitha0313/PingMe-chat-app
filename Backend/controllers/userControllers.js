import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/jwt.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, pic } = req.body;
    if (!name || !email || !password || !phone) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);  // 409 Conflict
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, phone, password, pic });
    if (user) {
        let token = generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            picture: user.pic,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Failed to create the User');
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
        const token = generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            picture: user.pic,
            token,
        });

    } else {
        res.status(409); // 409 Conflict
        console.log("Invalid credentials for email:", email);
        throw new Error('Invalid email or password');
    }
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
    const { profilePic } = req.body;
    const userId = req.params.id;
    if (!profilePic) {
        return res.status(400).json({ message: 'Profile picture is required.' });
    }
    try {
        // Update the user's `picture` field in the database
        // const updatedUser = await User.findByIdAndUpdate(
        //     userId,
        //     { picture: profilePic }, // Update with the Base64 string
        //     { new: true } // Return the updated document
        // );

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "user-profile-pics",
            transformation: { width: 200, height: 200, crop: "thumb" },
            format: "jpg",
        });
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { picture: uploadResponse.secure_url },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        } else {
            res.status(200).json({
                message: "Profile picture updated successfully.",
                imageUrl: uploadResponse.secure_url, // Return the updated user object
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating profile picture.", error });
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
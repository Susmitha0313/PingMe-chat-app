import express from 'express';
const router = express.Router();

import { 
    loginUser,
    registerUser,
    allUsers,
    logoutUser, 
    getUserProfile,
    updateUserProfile,
    updateProfilePic,
} from '../controllers/userControllers.js';

import { protect } from '../middleware/authMiddleware.js';

router.route("/").post(registerUser).get(protect , allUsers);
router.post('/login', loginUser);

router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.patch("/:id/upload-profile-pic", updateProfilePic);



export default router;

// POST /api/users - Register a user
// POST /api/users/auth - Authenticate a user and get token
// POST /api/users/logout - Logout user and clear cookie
// GET  /api/users/profile - get user profile
// PUT  /api/users/profile = update profile
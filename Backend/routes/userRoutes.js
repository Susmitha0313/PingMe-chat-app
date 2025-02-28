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


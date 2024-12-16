import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, allMessages, getNotification } from "../controllers/messageController.js";

//send
router.route("/").post(protect , sendMessage)
//fetchChat
router.route("/:chatId").get(protect, allMessages)
router.route("/:userId").get(protect, getNotification)
export default router;    
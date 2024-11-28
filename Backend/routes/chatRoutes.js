import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect, accessChat)
                .get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremoveperson").put(protect, removeFromGroup);
router.route("/groupaddperson").put(protect, addToGroup);

export default router;   
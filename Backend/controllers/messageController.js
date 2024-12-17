
import asyncHandler from "express-async-handler"
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js"

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    console.log("userID", req.user._id, content);
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };
    try {
        let message = await Message.create(newMessage);
        //as we are passing the instance of the mongoose class and npt directly we use execPopulate
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name pic email",
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })

        res.json(message) //error in here 
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const allMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    if (!chatId) {
        return res.status(400).json({ message: "Chat id is required" });
    }
    try {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve messages" });
    }
})


const getNotification = asyncHandler(async (req, res) => {
    try {
        const notification = await Message.find({ sender: req.params.userId });
        console.log(notification);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notification" });
    }
})

export { sendMessage, allMessages, getNotification }  
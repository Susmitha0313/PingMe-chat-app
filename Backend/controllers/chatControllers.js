import asyncHandler from "express-async-handler";
import Chats from "../models/chatModel.js";
import User from "../models/userModel.js";


const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("User Id not sent with request");
        return res.sendStatus(400);
    }
    var isChat = await Chats.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createChat = await Chats.create(chatData);
            const FullChat = await Chats.findOne({ _id: createChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chats.find({ users: { $elemMatch: { $eq: req.user._id } } }).then((result) => res.send(result))
            .populate("users", "-password")
            .populate("groupAdmin", "password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            })
    } catch (error) {
        res.send(400)
        throw new Error(error.message);
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to forn a group chat");
    }
    users.push(req.user);
    try {
        const groupChat = await Chats.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })
        const fullGroupChat = await Chats.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.send(400)
        throw new Error(error.message);
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    let { chatId, chatName } = req.body;
    const updatedChat = await Chats.findByIdAndUpdate(chatId, {
        chatName,
    }, { new: true, }).populate("users", "-password").populate("groupAdmin", "-password")
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chats not found");
    } else {
        res.json(updatedChat);
}
})

const addToGroup = asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;
    const added = Chats.findByIdAndUpdate(
        chatId,
        { $push: { users: userId }, }, { new: true });
})

const removeFromGroup = asyncHandler(async(req,res)=>{

})


export { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };
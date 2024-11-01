const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body; //It's the id of a person with whom logged in user wants to chat with.
    if (!userId) {
        console.log("userId params not sent with the request!");
        return res.status(400);
    }

    //In isChat variable I'm checking if there is already chat exists with this user.
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name profilePic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [userId, req.user._id],
        };
        try {

            const newChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);

        } catch (err) {
            res.status(400);
            throw new Error(err.message);
        }
    }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 }).then(async (result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "name profilePic email"
            })
            res.status(200).send(result);
        });
    } catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const createGropuChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields!" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send({ message: "More than two users are required to form a group chat!" });
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not Found!");
    } else {
        res.status(200).json(updatedChat);
    }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,
        {
            $push: { users: userId }
        },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");
    if (!added) {
        res.status(404);
        throw new Error("Chat not Found!");
    } else {
        res.status(200).json(added);
    }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: { users: userId }
        },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("Chat not Found!");
    } else {
        res.status(200).json(removed);
    }
});

module.exports = { accessChat, fetchChat, createGropuChat, renameGroup, addToGroup, removeFromGroup };
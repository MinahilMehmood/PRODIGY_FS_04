const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
        console.log("Invalid data passed into request!");
        return res.status(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name profilePic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name profilePic, email"
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = expressAsyncHandler(async (req, res) => {

    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name profilePic email").populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { sendMessage, allMessages };
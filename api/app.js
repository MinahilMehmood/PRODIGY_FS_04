const express = require("express");
const chats = require("./data");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB!");
}).catch((err) => {
    console.log("Error in connecting to mongoDB: " + err);
});

const server = app.listen(port, () => {
    console.log("Server is running on port " + port + "!");
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

app.use((req, res) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
});

app.use((err, req, res) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        mesaage: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("Chat.users is not defined!");
        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.off("setup", () => {
        console.log("User disconnected!");
        socket.leave(userData._id);
    })
});
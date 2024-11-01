const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { protect } = require("./../middleware/authorizeToken");
const { accessChat, fetchChat, createGropuChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController");

router.post("/", protect, accessChat);

router.get("/", protect, fetchChat);

router.post("/group", protect, createGropuChat);

router.put("/rename", protect, renameGroup);

router.put("/groupremove", protect, removeFromGroup);

router.put("/groupadd", protect, addToGroup);

module.exports = router;
const express = require("express");
const { sendMessage, allMessages } = require("../controllers/messageController");
const router = express.Router();
const { protect } = require("./../middleware/authorizeToken");

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

module.exports = router;
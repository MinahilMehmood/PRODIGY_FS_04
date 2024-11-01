const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { protect } = require("./../middleware/authorizeToken");

router.get("/", protect, async (req, res) => {
    const query = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};
    const users = await User.find(query).find({ _id: { $ne: req.user._id } });
    res.status(200).send(users);
});

module.exports = router;
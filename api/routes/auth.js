const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../token/generateToken");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all the fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePic: pic
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            pic: savedUser.profilePic,
            token: generateToken(savedUser._id)
        });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Failed to create the user." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(401).json({ message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, userExists.password);

        if (isPasswordValid) {
            res.status(200).json({
                _id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                pic: userExists.profilePic,
                token: generateToken(userExists._id)
            });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

module.exports = router;
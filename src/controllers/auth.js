import { Router } from "express";
import User from '../models/User.js';
import isExist from "./createUser.js";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
setTimeout(isExist, 1000);

const auth = Router();

// /auth/login
auth.get('/login', async (req, res) => {
    const { username, password } = req.query;
    try {
        const user = await User.findOne({ where: { username: username, password: password } });
        if (!user) return res.status(401).json({ message: "User not authenticated!" });
        let secret = {
            user: user.username,
            type: user.type
        }
        let token = jwt.sign({ data: secret }, process.env.JWT_SECRET_KEY)
        res.cookie('token', token);
        return res.status(200).json({ message: "User login successful!", user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
});

auth.get('/logout', (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
});

// /auth/register
auth.post('/register', async (req, res) => {
    const { username, password, type } = req.body;
    try {
        const user = await User.findOne({ where: { username: username } });
        if (user) return res.status(401).json({ message: "User already exists!" });

        const create = await User.create({ username: username, password: password, type: type || "user" });
        res.status(200).json({ message: "Registration successful!", user: create });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!", error: err });
    }
})

export default auth;
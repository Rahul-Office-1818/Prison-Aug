import { Router } from "express";
import User from '../models/User.js';
import isExist from "./createUser.js";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import { authConf } from "../configuration/index.js";
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

// /auth/signup
auth.post('/signup', async (req, res) => {
    const { username, password, type } = req.body;
    try {
        const user = await User.findOne({ where: { username: username } });
        if (user) return res.status(401).json({ payload: { message: "User already exists!" } });

        const create = await User.create({ username: username, password: password, type: type || "user" });
        res.status(201).json({ payload: { message: "Sign up successful!", user: create } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ payload: { message: "Internal server error!", error: err } });
    }
});

auth.get('/checkpass', (req, res) => {
    try {
        const { password } = req.query;
        if (!password) return res.status(401).json({ payload: { message: "Password not found!" } });
        if (password !== authConf.ADMIN_PASSWORD) return res.status(401).json({ payload: { message: "Invalid password!" } });
        return res.status(200).json({ payload: { message: "Password matched!" } });
    } catch (e) {
        console.log(err);
        res.status(500).json({ payload: { message: "Internal server error!", error: err } });
    }
})

export default auth;
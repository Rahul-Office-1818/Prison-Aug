import { Router } from "express";
import Jammer from '../models/Jammer.js';

const jammerApi = Router();

// J A M M E R O N L Y 
// /api/jammer
jammerApi.get("/", async (req, res) => {
    try {
        if (req.query.id) {
            const jammer = await Jammer.findOne({ where: { id: req.query.id } })
            if (!jammer) return res.status(404).json({ message: "Jammer not found!" });
            return res.status(200).json({ message: "Jammer found!", jammer });
        }
        const jammers = await Jammer.findAll();
        return res.status(200).json({ message: "Jammers retrieved successfully!", jammers });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
}).post("/", async (req, res) => {
    try {
        const jammer = await Jammer.create(req.body);
        return res.status(201).json({ message: "Jammer created successfully!", jammer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
}).put("/:id", async (req, res) => {
    try {
        if (!req.params.id) return res.status(404).json({ message: "Jammer id not found!" });
        const jammer = await Jammer.update(req.body, { where: { id: req.params.id } });
        return res.status(200).json({ message: "Jammer updated successfully!", jammer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
}).delete("/:id", async (req, res) => {
    try {
        if (!req.params.id) return res.status(404).json({ message: "Jammer id not found!" });
        const jammer = await Jammer.destroy({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Jammer deleted successfully!", jammer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
});

// B L O C K - O N L Y
// /api/jammer/block
jammerApi.get('/block', async (req, res) => {
    try {
        if (req.query.id) {
            const block = await Jammer.findAll({ where: { blockId: req.query.id } });
            if (!block) return res.status(404).json({ message: "Block not found!" });
            return res.status(200).json({ message: "Block found!", block });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
});

export default jammerApi;
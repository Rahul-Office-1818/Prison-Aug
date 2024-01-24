import { Router } from "express";
import Jammer from "../models/Jammer.js";
import { checkConnection } from "./common.helper.js";
import { name } from "ejs";
import middleware from "../../middleware/middleware.js";

// /api/ping
const route = Router();

route.get("/all", async (req, res) => {
    try {
        const jammers = await Jammer.findAll();
        let connection = await checkConnection(jammers);
        let jammersConnection = jammers.map((jammer, i) => { return { alive: connection[i].alive, id: jammer.id, blockId: jammer.blockId, name: jammer.name, ipAddress: jammer.ipAddress } });
        return res.status(200).json({ message: "Ping Successful!", payload: jammersConnection });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
})




export default route;
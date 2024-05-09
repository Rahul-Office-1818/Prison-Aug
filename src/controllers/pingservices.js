import { Router } from "express";
import middleware from "../../middleware/middleware.js";
import Jammer from "../models/Jammer.js";
import { checkConnection } from "./common.helper.js";


export class PingServices {
    routes

    constructor() {
        this.routes = Router();
        this.pingRoutes();
    }

    pingRoutes() {
        this.routes.get('/all', middleware, this.all);
    }

    async all(_, res) {
        try {
            const jammers = await Jammer.findAll();
            const all = await checkConnection(jammers);
            console.log(all,"Asasdasfsdf",all.length);
            res.json({ payload: all, status: 200 });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error!", error });
        }
    }
}

const pingServices = new PingServices().routes;
export default pingServices;
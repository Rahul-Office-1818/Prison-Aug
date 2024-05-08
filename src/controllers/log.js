import { Router } from 'express';
import Log from '../models/Log.js';
import middleware from '../../middleware/middleware.js';

const logRoutes = Router();

logRoutes.get("/", middleware, async (req, res) => {
    try {
        const logs = await Log.findAll(
            {
                order:[['id','DESC']]
            }
        );
        return res.status(200).json({ message: "Logs retrieved successfully!", payload: logs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", err: err, endPoint: '/api/logs' });
    }

})

export default logRoutes;
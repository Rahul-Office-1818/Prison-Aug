import { Router } from 'express';
import { toggleJammer } from './common.helper.js';
import Jammer from '../models/Jammer.js';
import Log from '../models/Log.js';

// api/jammer-toggle
const toggleJammerRoutes = Router();

toggleJammerRoutes.get("/", (req, res) => {
    try {
        let { id, name, block, ip, port, mode } = req.query;
        mode = Number(mode) ? "module1" : "module2";
        toggleJammer({ ip: ip, port: port, mode })
            .then(toggleRes => {
                let status = String(toggleRes).includes("OFF") ? 0 : 1;
                Jammer.update({ status: status }, { where: { id: id } })
                    .then(() => {
                        Log.create({ jammerId: id, jammerName: name, ipAddress: ip, ipPort: port, blockId: block, status: status })
                            .then(() => res.status(200).json({ message: toggleRes, status: status }))
                    })
            })
            .catch(err => res.status(404).json({ message: "Jammer connection lost", error: err }));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error!", err });
    }
})


export default toggleJammerRoutes;
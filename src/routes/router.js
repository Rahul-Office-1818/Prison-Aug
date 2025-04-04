import { Router } from 'express';
import { diagnosis, history, home, login, signup, setting, pflogs, cpulogs } from '../services/render.js';
import middleware from '../../middleware/middleware.js';
import AllJammerData, { allJammersLastStatus, JammerStatus } from '../controllers/jammerData.js';

import TileserverPage from '../TileServer/tileServer.js';

const router = Router();

// PAGE ROUTES.
router
    .get('/login', login)
    .get('/signup', signup)
    .get('/', middleware, home)
    .get("/setting", middleware, setting)
    .get("/history", middleware, history)
    .get("/pflogs", middleware, pflogs)
    .get("/diagnosis", middleware, diagnosis)
    .get('/tileserver',middleware, TileserverPage)
    .get("/cpulogs", middleware, cpulogs)
    .get("/alljammer", AllJammerData)
    .get("/all-jammer-last-status", allJammersLastStatus)
    .post("/last_status", JammerStatus)




export default router;
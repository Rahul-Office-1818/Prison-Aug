import { Router } from 'express';
import { diagnosis, history, home, login, setting } from '../services/render.js';

const router = Router();

// PAGE ROUTES.
router
    .get('/', home)
    .get('/login', login)
    .get("/setting", setting)
    .get("/history", history)
    .get("/diagnosis", diagnosis)


export default router;
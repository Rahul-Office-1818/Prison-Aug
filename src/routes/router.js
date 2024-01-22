import { Router } from 'express';
import { diagnosis, history, home, login, setting } from '../services/render.js';
import middleware from '../../middleware/middleware.js';

const router = Router();

// PAGE ROUTES.
router
    .get('/', middleware, home)
    .get('/login', login)
    .get("/setting", middleware, setting)
    .get("/history", middleware, history)
    .get("/diagnosis", middleware, diagnosis)


export default router;
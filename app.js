'use strict';
import { config } from 'dotenv';
import express from 'express';
import https from 'https';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import router from './src/routes/router.js';
import sequelize from './src/database/db.js';
import auth from './src/controllers/auth.js';
import jammer from './src/controllers/jammer.js';
import toggleJammerRoutes from './src/controllers/toggleJammer.js';
import logRoutes from './src/controllers/log.js';
import ping from './src/controllers/ping.js';
config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERT)
}
const secureApp = https.createServer(options, app)

app
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/modules', express.static(path.join(__dirname, 'node_modules')))
    .use('/assets', express.static(path.join(__dirname, 'assets')))
    .set('view engine', 'ejs')
    .use(router)
    .use('/auth', auth)
    .use('/api/jammer', jammer)
    .use('/api/ping', ping)
    .use('/api/logs', logRoutes)
    .use("/api/jammer-toggle", toggleJammerRoutes)

sequelize.sync()
    .then(() => {
        // secureApp.listen(process.env.SECURE_PORT, process.env.SECURE_HOST, () => console.log(` [${new Date().toLocaleTimeString()}] SERVER RUNNING ON https://${process.env.SECURE_HOST}:${process.env.SECURE_PORT}`))
        app.listen(process.env.PORT, process.env.HOST, () => console.log(` [${new Date().toLocaleTimeString()}] SERVER RUNNING ON http://${process.env.HOST}:${process.env.PORT}`))
    })
    .catch(err => {
        console.log(err);
        process.exit(500);
    })

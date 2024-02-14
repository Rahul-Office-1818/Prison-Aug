import { Router } from "express";
import { chennalConf, deviceToggleConf, voltage } from "../configuration/index.js";
import { ardiunoCommunication } from "./common.helper.js";

export class AutomationService {
    routes
    constructor() {
        this.routes = Router();
        this.init();
    }

    init() {
        this.routes
            .get('/health', this.health)
            .get('/smpsvoltage', this.voltage)
            .get('/channel', this.channel)
            .get('/allchannel', this.allChannel)
            .get('/status', this.channelStatus)
    }

    health(req, res) {
        try {
            res.status(200).json({ payload: { message: "Good" } });
        } catch (err) {
            res.status(500).json({ payload: { message: "Bad", err } });
        }
    }

    async channelStatus(req, res) {
        try {
            const { port, address } = req.query;
            if (!port || !address) return res.status(406).json({ payload: { message: "Port or Address is missing" } });
            const promise = await ardiunoCommunication(chennalConf.ALL_STATUS, { address: address, port: port });
            const response = String(promise.payload).substring(0, 17).trim().split(' ').sort().map((item, i) => (String(item).includes('1') ? true : false));
            res.status(200).json({ payload: response });
        } catch (err) {
            console.log('Error in automation service || automation/channel', err);
            res.status(500).json({ payload: { message: 'Invalid request', err } });
        }
    }

    async allChannel(req, res) {
        try {
            const { currentstatus, port, address } = req.query;
            if (!currentstatus || !port || !address) return res.status(406).json({ payload: { message: "Command or Port or Address is missing" } });
            let command = (currentstatus === 'true') ?
                chennalConf.ALL_OFF :
                chennalConf.ALL_ON;

            const promise = await ardiunoCommunication(command, { address: address, port: port });
            const response = String(promise.payload).substring(0, 17).trim().split(' ').sort().map((item, i) => (String(item).includes('1') ? true : false));
            res.status(200).json({ payload: response });
        } catch (err) {
            console.log('Error in automation service || automation/channel', err);
            res.status(500).json({ payload: { message: 'Invalid request', err } });
        }
    }

    // B0 = channel / module off
    // A1 = channel / module on
    async channel(req, res) {
        try {
            const { channel, port, address, currentstatus } = req.query;
            if (!currentstatus || !channel || !port || !address) return res.status(400).json({ payload: { message: "Channel or Port or Address or Status is missing" } });

            let command = (currentstatus === 'true') ?
                chennalConf.OFF[Object.keys(chennalConf.OFF)[Number(channel) - 1]] :
                chennalConf.ON[Object.keys(chennalConf.ON)[Number(channel) - 1]]

            const promise = await ardiunoCommunication(command, { address: address, port: port });
            const response = String(promise.payload).trim();
            res.status(200).json({ payload: { response: response, status: response.includes("1") ? true : false } })
        } catch (err) {
            console.log('Error in automation service || automation/channel', err);
            res.status(500).json({ payload: { message: 'Invalid request', err } });
        }
    }

    async voltage(req, res) {
        try {
            const { port, address } = req.query;
            if (!port || !address) res.status(400).json({ payload: { message: "Port or Address is missing" } });
            const promise = await ardiunoCommunication(voltage.SMPS_VOLTAGE, { address: address, port: port });
            const response = String(promise.payload).match(/\d+\.\d+/g).map(item=> Number(item));
            res.status(200).json({ payload: response });
        } catch (err) {
            console.log('Error in automation service || automation/vsmpsvoltage', err);
            res.status(500).json({ error: 'Invalid request' });
        }
    }

}

export default new AutomationService().routes;
import { config } from "dotenv";

config();
export default {
    SMPS_VOLTAGE: process.env.SMPS_VOLTAGE,
    JAMMER_VOLTAGE: process.env.JAMMER_VOLTAGE
}
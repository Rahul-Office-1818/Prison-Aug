import { config } from "dotenv";

config();
export default {
    ON: {
        CHENNAL_1: process.env.CHANNEL_ON_1,
        CHENNAL_2: process.env.CHANNEL_ON_2,
        CHENNAL_3: process.env.CHANNEL_ON_3,
        CHENNAL_4: process.env.CHANNEL_ON_4,
        CHENNAL_5: process.env.CHANNEL_ON_5,
        CHENNAL_6: process.env.CHANNEL_ON_6,
    },
    OFF: {
        CHENNAL_1: process.env.CHANNEL_OFF_1,
        CHENNAL_2: process.env.CHANNEL_OFF_2,
        CHENNAL_3: process.env.CHANNEL_OFF_3,
        CHENNAL_4: process.env.CHANNEL_OFF_4,
        CHENNAL_5: process.env.CHANNEL_OFF_5,
        CHENNAL_6: process.env.CHANNEL_OFF_6,
    },
    ALL_STATUS: process.env.MODULE_STATUS,
    ALL_ON: process.env.CHANNEL_ON_ALL,
    ALL_OFF: process.env.CHANNEL_OFF_ALL,
}
import { config } from "dotenv"
config();

export default {
    PCU_BOX: {
        ON: process.env.PCU_JAMMER_ON,
        OFF: process.env.PCU_JAMMER_OFF,
    },
    PMCU_BOX: {
        ON: process.env.PMCU_JAMMER_ON,
        OFF: process.env.PMCU_JAMMER_OFF,
    },
    TEAMPERATURE: process.env.TEAMPERATURE
} 
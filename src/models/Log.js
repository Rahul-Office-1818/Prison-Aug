import sequelize from '../database/db.js';
import Datatypes from 'sequelize';

const Log = sequelize.define("Log", {
    id: {
        primaryKey: true,
        type: Datatypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    jammerId: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    jammerName: {
        type: Datatypes.STRING,
        allowNull: false
    },
    ipAddress: {
        type: Datatypes.STRING,
        allowNull: false
    },
    ipPort: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    blockId: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    jammer_on: {
        type: Datatypes.STRING,
        allowNull: false
    },
    jammer_off: {
        type: Datatypes.STRING,
        allowNull: true,
    },
    diffrence: {
        type: Datatypes.STRING,
        allowNull: true,
    },
    dateTime: {
        type: Datatypes.STRING,
        defaultValue: new Date().toString(),
        allowNull: false
    }
}, { timestamps: true });

export default Log;


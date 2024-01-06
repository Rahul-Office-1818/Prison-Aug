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
    status: {
        type: Datatypes.INTEGER,
        allowNull: false
    }
}, { timestamps: true });

export default Log;
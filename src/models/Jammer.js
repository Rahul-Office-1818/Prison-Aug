import sequelize from '../database/db.js';
import Datatypes from 'sequelize';

const Jammer = sequelize.define('Jammer', {
    id: {
        primaryKey: true,
        type: Datatypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    blockId: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    name: {
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
    lat: {
        type: Datatypes.STRING,
        allowNull: false
    },
    lng: {
        type: Datatypes.STRING,
        allowNull: false
    },
}, { timestamps: true });

export default Jammer;
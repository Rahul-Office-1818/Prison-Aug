import sequelize from '../database/db.js';
import Datatypes from 'sequelize';

const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        type: Datatypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Datatypes.STRING,
        allowNull: false
    },
    password: {
        type: Datatypes.STRING,
        allowNull: false
    }
}, {timestamps: true});

export default User;
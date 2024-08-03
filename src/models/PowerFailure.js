import sequelize from '../database/db.js';
import Datatypes from 'sequelize';

const PowerFailure = sequelize.define('PowerFailure', {
    jammer_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
    },
    jammer_name: {
        type: Datatypes.STRING,
        allowNull: false,
    },
    FROM: {
        type: Datatypes.STRING,
        allowNull: false,

    },
    To: {
        type: Datatypes.STRING,
        allowNull: false,

    },
    Duration: {
        type: Datatypes.STRING,
        allowNull: false,

    },
    dateTime: {
        type: Datatypes.STRING,
        defaultValue: new Date().toString(),
        allowNull: false
    }
}, { timestamps: true })

export default PowerFailure
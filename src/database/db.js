import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        logging: false
        // logging: (msg)=> console.log(msg)
    }
);

export default sequelize;
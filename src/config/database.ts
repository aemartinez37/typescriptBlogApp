import { Sequelize } from 'sequelize';

export const database = new Sequelize({
    database: 'blogdb',
    dialect: 'postgres',
    username: 'postgres',
    password: '',
    host: "127.0.0.1",
    logging: false,
});
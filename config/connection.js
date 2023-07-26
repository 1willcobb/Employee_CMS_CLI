const sql = require('mysql2')
const helpers = require('../modules/colors')

const db = sql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: process.env.DB,
    },
    helpers.logOJ3(`connected to ${process.env.DB}`)
);

module.exports = db;

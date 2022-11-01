const mysql2 = require('mysql2');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '../.env')});

const db = mysql2.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DATABASE
}).promise();

module.exports = db;
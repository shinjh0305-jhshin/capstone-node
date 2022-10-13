const mysql2 = require('mysql2');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '../.env')});

const db = mysql2.createPool({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
}).promise();

module.exports = db;
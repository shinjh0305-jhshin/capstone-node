const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

console.log(process.env.DBUSER);

app.use(cors());

const auth = require('./routes/auth');


app.use('/auth', auth);

app.post('/', )
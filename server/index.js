require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

import {router as users} from "./routes/index";

app.use(cors());

//const users = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/users', users);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on ${process.env.SERVER_PORT}`);
})
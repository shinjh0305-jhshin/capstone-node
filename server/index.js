const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

app.use(cors());

const auth = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/auth', auth);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on ${process.env.SERVER_PORT}`);
})
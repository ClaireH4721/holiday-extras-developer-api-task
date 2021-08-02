const express = require('express');
const cors = require('cors');

const users = require('./routes');

const app = express();
app.disable("x-powered-by");

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api/users', users);

module.exports = app;

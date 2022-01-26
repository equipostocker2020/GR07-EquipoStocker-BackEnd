let express = require('express');
let app = express();

const { login } = require('../controllers/login.controller');

app.post("/", login);

module.exports = app;
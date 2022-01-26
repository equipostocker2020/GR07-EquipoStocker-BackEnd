let express = require("express");
let app = express();

const { getImage } = require('../controllers/imagen.controller');

app.get("/:tipo/:img", getImage);

module.exports = app;
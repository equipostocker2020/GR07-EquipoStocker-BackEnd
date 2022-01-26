let express = require("express");
let app = express();

const { findByColection, findTodo } = require('../controllers/busqueda.controller');

app.get("/coleccion/:tabla/:busqueda", findByColection);

app.get("/todo/:busqueda", findTodo);


module.exports = app;
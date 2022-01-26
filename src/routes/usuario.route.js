//requires
let express = require("express");
let app = express();

//middleware
let mdAutenticacion = require("../middlewares/autenticacion");

const { getUsuarios, addUsuarios, editUsuarios, deleteUsuarios } = require('../controllers/usuario.controller');

app.get("/", getUsuarios);

app.post("/", addUsuarios);

app.put("/:id", mdAutenticacion.verificaToken, editUsuarios);

app.delete("/:id", mdAutenticacion.verificaToken, deleteUsuarios);

//exportando modulo
module.exports = app;
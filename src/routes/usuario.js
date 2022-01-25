//requires
var express = require("express");
var app = express();

//middleware
var mdAutenticacion = require("../middlewares/autenticacion");

const { getUsuarios, addUsuarios, editUsuarios, deleteUsuarios } = require('../controller/usuario');

app.get("/", getUsuarios);

app.post("/", addUsuarios);

app.put("/:id", mdAutenticacion.verificaToken, editUsuarios);

app.delete("/:id", mdAutenticacion.verificaToken, deleteUsuarios);

//exportando modulo
module.exports = app;
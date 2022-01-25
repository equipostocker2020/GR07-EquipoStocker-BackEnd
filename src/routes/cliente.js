//requires
var express = require("express");
var app = express();

//middleware
var mdAutenticacion = require("../middlewares/autenticacion");

const { getClientes, addCliente, updateClienteById, deleteCliente } = require('../controller/cliente.controller');

app.get("/", getClientes);

app.post("/", mdAutenticacion.verificaToken, addCliente);

app.put("/:id", mdAutenticacion.verificaToken, updateClienteById);

app.delete("/:id", mdAutenticacion.verificaToken, deleteCliente);

//exportando modulo
module.exports = app;
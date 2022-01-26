let express = require("express");
let app = express();

let mdAutenticacion = require("../middlewares/autenticacion");

const { getClientes, addCliente, updateClienteById, deleteCliente } = require('../controllers/cliente.controller');

app.get("/", getClientes);

app.post("/", mdAutenticacion.verificaToken, addCliente);

app.put("/:id", mdAutenticacion.verificaToken, updateClienteById);

app.delete("/:id", mdAutenticacion.verificaToken, deleteCliente);

module.exports = app;
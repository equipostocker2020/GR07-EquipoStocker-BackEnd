let express = require("express");
let app = express();

let mdAutenticacion = require("../middlewares/autenticacion");

const {getPedidos, getPedidoById, getPedidosPorCliente, addPedido, updatePedido, deletePedido} = require ('../controllers/pedido.controller');

app.get("/", getPedidos);

app.get("/:id", getPedidoById);

app.get("/cliente/:id", getPedidosPorCliente);

app.post("/", mdAutenticacion.verificaToken, addPedido);

app.put("/:id", mdAutenticacion.verificaToken, updatePedido);

app.delete("/:id", mdAutenticacion.verificaToken, deletePedido);

module.exports = app;
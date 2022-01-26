let express = require("express");
let app = express();

let mdAutenticacion = require("../middlewares/autenticacion");

const { getProducto, getProductoById, addProducto, updateProducto, deleteProducto } = require('../controller/producto.controller');

app.get("/", getProducto);

app.get("/:id", getProductoById);

app.post("/", mdAutenticacion.verificaToken, addProducto);

app.put("/:id", mdAutenticacion.verificaToken, updateProducto);

app.delete("/:id", mdAutenticacion.verificaToken, deleteProducto);

module.exports = app;
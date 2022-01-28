let express = require("express");
let app = express();
let mdAutenticacion = require("../middlewares/autenticacion");
const {getProveedor, postProveedor, updtProveedor, deleteProveedor} = require ('../controllers/proveedor.controller');

app.get("/", getProveedor);
app.post("/", mdAutenticacion.verificaToken, postProveedor);
app.put("/:id", mdAutenticacion.verificaToken, updtProveedor);
app.delete("/:id", mdAutenticacion.verificaToken, deleteProveedor);

module.exports = app;
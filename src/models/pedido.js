var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var estadoPedido = {
    values: ["enviado", "preparación", "cancelado"],
    message: "{VALUE} no es un estado permitido ",
};

var pedidoSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
        required: [false, "El cliente es necesario"] 
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: [false, "El producto es necesario"] 
    },
    cantidad: { type: Number, required: [false, "la cantidad es necesaria"] },
    estado: {
        type: String,
        required: true,
        default: "preparación",
        enum: estadoPedido,
    },
    total: { type: Number, required: [false] },
    numero_pedido: { type: String, required: [false] },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },

}, { collection: "pedidos" });

pedidoSchema.plugin(uniqueValidator, { message: "debe ser único" });
module.exports = mongoose.model("Pedido", pedidoSchema);
// requires
var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

// importando esquema
var Schema = mongoose.Schema;

// generando campos al schema
var productoSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    descripcion: {
        type: String,
        required: [true, "La descripcion es necesaria"],
    },
    img: { type: String, required: false },
    stock: { type: String, required: [true, "El stock es necesario"] },
    precio: { type: String, required: [true, " El precio es necesario"] },
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: "Proveedor",
    },
}, { collection: "productos" });

// validando path
productoSchema.plugin(uniqueValidator, { message: "debe ser único" });

// exportando el modulo para utilizarlo
module.exports = mongoose.model("Producto", productoSchema);
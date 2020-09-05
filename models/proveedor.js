// requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// importando esquema
var Schema = mongoose.Schema;

var estados = {
    values: ["ACTIVO", "INACTIVO"],
    message: "{VALUE} no es un estado permitido",
};

// generando campos al schema 
var proveedorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    direccion: { type: String, required: false },
    cuit: { type: String, unique: true, required: [true, 'El CUIT es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    telefono: { type: String, required: false },
    situacion_afip: { type: String, unique: true, required: [true, 'La situacion de AFIP es obligatoria'] },
    img: { type: String, required: false },
    estado: {
        type: String,
        required: true,
        default: "ACTIVO",
        enum: estados,
    },
    usuario_modifica: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
});

// validando path
proveedorSchema.plugin(uniqueValidator, { message: 'debe ser único' });

// exportando el modulo para utilizarlo
module.exports = mongoose.model('Proveedor', proveedorSchema);
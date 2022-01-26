let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let estados = {
    values: ["ACTIVO", "INACTIVO"],
    message: "{VALUE} no es un estado permitido",
};

let proveedorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    direccion: { type: String, required: false },
    cuit: { type: String, unique: true, required: [true, 'El CUIT es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    telefono: { type: String, required: false },
    situacion_afip: { type: String, required: [true, 'La situacion de AFIP es obligatoria'] },
    estado: {
        type: String,
        required: true,
        default: "ACTIVO",
        enum: estados,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    img: { type: String, required: false },
});

proveedorSchema.plugin(uniqueValidator, { message: 'debe ser único' });

module.exports = mongoose.model('Proveedor', proveedorSchema);
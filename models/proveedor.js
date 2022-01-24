// requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// importando esquema
var Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *  schemas:
 *      Proveedor:
 *          type: object
 *          required:
 *              - nombre
 *              - email
 *              - cuit
 *              - situacion_afip
 *              - estado
 *          properties:
 *              nombre:
 *                  type: string
 *              direccion:
 *                  type: string
 *              cuit:
 *                  type: string
 *              email:
 *                  type: string
 *              telefono:
 *                  type: string
 *              situacion_afip:
 *                  type: string
 *              estado:
 *                  type: string
 *                  enum: ["ACTIVO", "INACTIVO"]
 *                  default: "ACTIVO"
 *              usuario:
 *                  $ref: '#/components/schemas/Usuario'
 *              img:
 *                  type: string
 */
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

// validando path
proveedorSchema.plugin(uniqueValidator, { message: 'debe ser único' });

// exportando el modulo para utilizarlo
module.exports = mongoose.model('Proveedor', proveedorSchema);
// requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// importando esquema
var Schema = mongoose.Schema;


// generando campos al schema 


var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    direccion: { type: String, required: false },
    cuit: { type: String, unique: true, required: [true, 'El cuit es necesario'] },
    telefono: { type: String, required: false },
    dni: { type: String, unique: true, required: [true, 'El dni es necesario'] },
    img: { type: String, required: false },

});

// validando path
clienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });


// exportando el modulo para utilizarlo
module.exports = mongoose.model('Cliente', clienteSchema);
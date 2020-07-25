var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    img: { type: String, required: false },
    stock: { type: String, required: [true, "El stock es necesario"] },
    precio: { type: String, required: [true, " El precio es necesario"] },
    //codigo_barra: {type : String, required : false},
    //codigo_qr : {type:String, require : false},
    // usuario: {type: Schema.Types.ObjectId, ref : 'Usuario'},
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        // required: [true, "el id del proveedor es requerido"],
        //required: [true, "el nombre del proveedor es requerido"]
    }


}, { collection: 'productos' });

productoSchema.plugin(uniqueValidator, { message: 'debe ser único' });

module.exports = mongoose.model('Producto', productoSchema);
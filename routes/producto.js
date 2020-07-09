var express = require('express');
var app = express();

var Producto = require('../models/producto');


var mdAutenticacion = require('../middlewares/autenticacion');



// obtiene todos los productos, preparada para paginar.
app.get('/', (req, res) => {
    var desde = req.params.desde || 0;
    desde = Number(desde);


    Producto.find({})
        .skip(desde)
        .limit(15)
        .populate('proveedor', 'nombre email telefono')
        .exec((err, productos, proveedor) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando productos',
                    errors: err
                });
            }
            Producto.count({}, (err, conteo) => {
                res.status(200).json({

                    ok: true,
                    productos: productos,
                    proveedor: proveedor,
                    total: conteo
                });
            });
        });
});


// crea un producto especifico.

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        img: body.img,
        stock: body.stock,
        precio: body.precio,
        //codigo_barra : body.codigo_barra,
        //codigo_qr: body.codigo_qr,
        proveedor: body.proveedor
    });
    producto.save((err, productoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al generar producto',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoGuardado,
            productoToken: req.producto
        });
    });
});


module.exports = app;
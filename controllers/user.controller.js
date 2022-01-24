var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");
var Usuario = require("../models/usuario");
var mdAutenticacion = require("../middlewares/autenticacion");
var bcrypt = require("bcryptjs");

// exports.getUsuarios = function(req, res) {
//     // var desde = req.query.desde || 0;
//     Usuario.find({},
//             "nombre apellido empresa email img role password cuit dni direccion telefono usuario")
//         // .skip(desde)
//         .limit(15)
//         .exec((err, usuarios) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: "Error cargando usuarios",
//                     errors: err,
//                 });
//             }
//             Usuario.count({}, (err, conteo) => {
//                 res.status(200).json({
//                     ok: true,
//                     usuarios: usuarios,
//                     total: conteo,
//                 });
//             });
//         });
// };

exports.getUsuarios = app.get("/", (req, res) => {
    // enumerando
    var desde = req.query.desde || 0;
    // busca y mapea los atributos marcados
    Usuario.find({},
            "nombre apellido empresa email img role password cuit dni direccion telefono usuario")
        .skip(desde)
        .limit(15)

    // ejecuta, puede tener un error manejado.
    .exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando usuarios",
                errors: err,
            });
        }
        // metodo count donde va contando usuarios simplemente muestra un int que se incrementa con cada nuevo registro
        Usuario.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                total: conteo,
            });
        });
    });
});
// module.exports = app;
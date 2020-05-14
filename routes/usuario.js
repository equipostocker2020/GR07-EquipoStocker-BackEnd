//requires
var express = require('express');
var app = express();

// //json web token
var jwt = require('jsonwebtoken');


//requiere modelo
var Usuario = require('../models/usuario');

//middleware
var mdAutenticacion = require('../middlewares/autenticacion');

// falta encriptar contraseña.
var bcrypt = require('bcryptjs');

// método para crear usuario

app.post('/', (req, res) => {

    // seteo el body que viaja en el request. Todos los campos required del modelo deben estar aca si no falla
    // esto se setea en postan. Al hacer la peticion post en el body tipo x-www-form-urlencoded.

    var body = req.body;


    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        empresa: body.empresa,
        img: body.img,
        direccion: body.direccion,
        cuit: body.cuit,
        dni: body.dni,
        telefono: body.telefono,
        role: body.role,
        email: body.email,
        cuit: body.cuit,
        password: bcrypt.hashSync(body.password, 10),

    });

    // si se mando el request correcto se guarda. Este metodo puede traer un error manejado.

    usuario.save((err, usuarioGuardado) => {
        // si hay un error....
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        // si pasa ok ...
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

});

//exportando modulo

module.exports = app;
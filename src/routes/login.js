// requires
let express = require('express');
let app = express();
//Módulo para encriptar contraseña
let bcrypt = require('bcryptjs');
//jwt
let jwt = require('jsonwebtoken');
let Usuario = require('../models/usuarioModel');
// constantes
let SEED = require('../config/config').SEED;

//metodo para logearse donde valida mail (user) y pass. trae token cada vez que se envia.
app.post('/', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales invalidas - email',
                errors: err
            });

        }
        if (!body.password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error request',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales invalidas - password',
                errors: err
            })
        }
        usuarioDB.password = '=)';
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4hs

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });
});

module.exports = app;
// requires
var jwt = require('jsonwebtoken');

// constante
var SEED = require('../config/config').SEED;


// verifica token lo usamos como middleware


exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token',
                errors: err
            });
        }
        req.usuario = decoded.usuario;

        next();
    });
}
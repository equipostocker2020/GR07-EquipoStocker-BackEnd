var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
/** 
 * Funcion verifica token a traves de JWT
 * lo usamos como middleware de la aplicación
 * @author Stocker
 * */
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
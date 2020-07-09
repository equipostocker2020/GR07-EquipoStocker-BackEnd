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


// obtener usuarios...
app.get('/', (req, res) => {
    // enumerando 
    var desde = req.query.desde || 0;
    // busca y mapea los atributos marcados
    Usuario.find({}, 'nombre apellido empresa email img role password cuit dni direccion')
        .skip(desde)
        .limit(15)

    // ejecuta, puede tener un error manejado.
    .exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        // metodo count donde va contando usuarios simplemente muestra un int que se incrementa con cada nuevo registro
        Usuario.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                total: conteo
            });
        })
    })
});
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

//actualizar usuario
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ID' + id + ' no existe',
                errors: { message: ' No existe un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.apellido = body.apellido;
        usuario.empresa = body.empresa;
        usuario.email = body.email;
        usuario.direccion = body.direccion;
        usuario.dni = body.dni;
        usuario.cuit = body.cuit;
        usuario.telefono = body.telefono;
        usuario.role = body.role;
        usuario.password = body.password;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err,
                });
            }
            usuarioGuardado.password = bcrypt.hashSync(body.password, 10);
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con este ID',
                errors: { message: 'No existe un usuario con este ID' }
            });

        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


//exportando modulo
module.exports = app;
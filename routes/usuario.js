/**
 * @swagger
 * tags:
 *  name: Usuario
 *  description: Endpoint para el manejo de los usuarios
 */

//requires
var express = require("express");
var app = express();

// //json web token
var jwt = require("jsonwebtoken");

//requiere modelo
var Usuario = require("../models/usuario");

//middleware
var mdAutenticacion = require("../middlewares/autenticacion");

// falta encriptar contraseña.
var bcrypt = require("bcryptjs");

const { getUsuarios, addUsuarios } = require('../controller/usuario');

/**
 * @swagger
 * /usuario?desde={desde}:
 *  get:
 *      summary: Retorna la lista de usuarios
 *      tags: [Usuario]
 *      parameters:
 *          -   in: query
 *              name: desde
 *              schema:
 *                  type: number
 *              description: Numero desde donde empieza la paginacion
 *      responses:
 *          200:
 *              description: Lista de usuarios
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  usuarios:                         
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Usuario'
 *                                  total:                         
 *                                      type: number
 *          500:
 *              description: Error cargando los usuarios
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.get("/", getUsuarios);

/**
 * @swagger
 * /usuario:
 *  post:
 *      summary: Se crea un usuario
 *      tags: [Usuario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *          201:
 *              description: Usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  usuarios:                         
 *                                      $ref: '#/components/schemas/Usuario'
 *                                  usuarioToken:                         
 *                                      type: string
 *          400:
 *              description: Error al crear el usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.post("/", addUsuarios);

/**
 * @swagger
 * /usuario/{id}:
 *  put:
 *      summary: Se modifica un usuario
 *      tags: [Usuario]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *          200:
 *              description: Usuario modificado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  usuario:                         
 *                                      $ref: '#/components/schemas/Usuario'
 *          400:
 *              description: Error al buscar el usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 *          500:
 *              description: Error al actualizar el usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err,
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con el ID" + id + " no existe",
                errors: { message: " No existe un usuario con ese ID" },
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
        usuario.password = usuario.password;
        usuario.usuario = body.email;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: err,
                });
            }
            usuarioGuardado.password = bcrypt.hashSync(body.password, 10);
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
});

/**
 * @swagger
 * /usuario/{id}:
 *  delete:
 *      summary: Se elimina un usuario
 *      tags: [Usuario]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: Id del usuario
 *      responses:
 *          200:
 *              description: Usuario eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  usuario:                         
 *                                      $ref: '#/components/schemas/Usuario'
 *          400:
 *              description: No existe un usuario con este ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 *          500:
 *              description: Error al eliminar al usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario",
                errors: err,
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un usuario con este ID",
                errors: { message: "No existe un usuario con este ID" },
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
        });
    });
});

//exportando modulo
module.exports = app;
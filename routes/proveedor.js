/**
 * @swagger
 * tags:
 *  name: Proveedor
 *  description: Endpoint para el ingreso de pedidos
 */

//requires
var express = require("express");
var app = express();
// //json web token
var jwt = require("jsonwebtoken");
//requiere modelo
var Proveedor = require("../models/proveedor");
//middleware
var mdAutenticacion = require("../middlewares/autenticacion");
// falta encriptar contraseña.
var bcrypt = require("bcryptjs");

/**
 * @swagger
 * /proveedor?desde={desde}:
 *  get:
 *      summary: Retorna la lista de proveedores
 *      tags: [Proveedor]
 *      parameters:
 *          -   in: query
 *              name: desde
 *              schema:
 *                  type: number
 *              description: Numero desde donde empieza la paginacion
 *      responses:
 *          200:
 *              description: Lista de proveedores
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  proveedor:                         
 *                                      $ref: '#/components/schemas/Proveedor'
 *                                  usuario:
 *                                      $ref: '#/components/schemas/Usuario'
 *                                  total:                         
 *                                      type: number
 *          500:
 *              description: Error cargando proveedores
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.get("/", (req, res) => {
    // enumerando
    var desde = req.query.desde || 0;
    // busca y mapea los atributos marcados
    Proveedor.find({}, "nombre direccion cuit email telefono situacion_afip img estado")
        .skip(desde)
        .limit(15)
        .populate("usuario", "email")
        // ejecuta, puede tener un error manejado.
        .exec((err, proveedor, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando proveedor",
                    errors: err,
                });
            }
            // metodo count donde va contando proveedor simplemente muestra un int que se incrementa con cada nuevo registro
            Proveedor.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    proveedor: proveedor,
                    usuario: usuario,
                    total: conteo,
                });
            });
        });
});

/**
 * @swagger
 * /proveedor:
 *  post:
 *      summary: Se crea un proveedor
 *      tags: [Proveedor]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Proveedor'
 *      responses:
 *          201:
 *              description: Prooverdor creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  proveedor:                         
 *                                      $ref: '#/components/schemas/Proveedor'
 *                                  proveedorToken:                         
 *                                      type: string
 *          400:
 *              description: Error al crear el Prooverdor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
    // seteo el body que viaja en el request. Todos los campos required del modelo deben estar aca si no falla
    // esto se setea en postam. Al hacer la peticion post en el body tipo x-www-form-urlencoded.
    var body = req.body;
    var proveedor = new Proveedor({
        nombre: body.nombre,
        direccion: body.direccion,
        cuit: body.cuit,
        email: body.email,
        telefono: body.telefono,
        situacion_afip: body.situacion_afip,
        logo: body.logo,
        costo_unidad: body.costo_unidad,
        costo_mayorista: body.mayorista,
        estado: body.estado,
        usuario: body.usuario,
    });
    // si se mando el request correcto se guarda. Este metodo puede traer un error manejado.
    proveedor.save((err, proveedorGuardado) => {
        // si hay un error....
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear proveedor",
                errors: err,
            });
        }
        // si pasa ok ...
        res.status(201).json({
            ok: true,
            proveedor: proveedorGuardado,
            proveedorToken: req.proveedores,
        });
    });
});

/**
 * @swagger
 * /proveedor/{id}:
 *  put:
 *      summary: Se modifica un proveedor
 *      tags: [Proveedor]
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
 *                      $ref: '#/components/schemas/Proveedor'
 *      responses:
 *          200:
 *              description: Proveedor modificado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  proveedor:                         
 *                                      $ref: '#/components/schemas/Proveedor'
 *          400:
 *              description: Error al actualizar el proveedor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 *          500:
 *              description: Error al actualizar el proveedor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Proveedor.findById(id, (err, proveedor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar proveedor",
                errors: err,
            });
        }

        if (!proveedor) {
            return res.status(400).json({
                ok: false,
                mensaje: "El proveedor con el ID" + id + " no existe",
                errors: { message: " No existe un proveedor con ese ID" },
            });
        }

        proveedor.nombre = body.nombre;
        proveedor.direccion = body.direccion;
        proveedor.cuit = body.cuit;
        proveedor.email = body.email;
        proveedor.telefono = body.telefono;
        proveedor.situacion_afip = body.situacion_afip;
        proveedor.logo = body.img;
        proveedor.estado = body.estado;
        proveedor.usuario = body.usuario;

        proveedor.save((err, proveedorGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar proveedor",
                    errors: err,
                });
            }
            proveedorGuardado.password = "=)";
            res.status(200).json({
                ok: true,
                proveedor: proveedorGuardado,
            });
        });
    });
});

/**
 * @swagger
 * /proveedor/{id}:
 *  delete:
 *      summary: Se elimina un proveedor
 *      tags: [Proveedor]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: Id del proveedor a eliminar
 *      responses:
 *          200:
 *              description: Proveedor eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  proveedor:                         
 *                                      $ref: '#/components/schemas/Proveedor'
 *          400:
 *              description: No existe un proveedor con ese id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 *          500:
 *              description: Error al eliminar el Proveedor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Proveedor.findByIdAndRemove(id, (err, proveedorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar proveedor",
                errors: err,
            });
        }

        if (!proveedorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un proveedor con este ID",
                errors: { message: "No existe un proveedor con este ID" },
            });
        }

        res.status(200).json({
            ok: true,
            proveedor: proveedorBorrado,
        });
    });
});

module.exports = app;
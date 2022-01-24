/**
 * @swagger
 * tags:
 *  name: Producto
 *  description: Endpoint para el manejo de los productos
 */

// requires
var express = require("express");
var app = express();
var Producto = require("../models/producto");
var mdAutenticacion = require("../middlewares/autenticacion");

/**
 * @swagger
 * /producto?desde={desde}:
 *  get:
 *      summary: Retorna la lista de productos
 *      tags: [Producto]
 *      parameters:
 *          -   in: query
 *              name: desde
 *              schema:
 *                  type: number
 *              description: Numero desde donde empieza la paginacion
 *      responses:
 *          200:
 *              description: Lista de productos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                              productos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Producto'
 *                              proveedor:
 *                                  $ref: '#/components/schemas/Proveedor'
 *                              usuario:
 *                                  $ref: '#/components/schemas/Usuario'
 *                              total:
 *                                  type: number
 *          500:
 *              description: Error cargando productos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.get("/", (req, res) => {
    var desde = req.params.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(15)
        .populate("proveedor", "nombre email telefono estado")
        .populate("usuario")
        .exec((err, productos, proveedor, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando productos",
                    errors: err,
                });
            }
            Producto.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    productos: productos,
                    proveedor: proveedor,
                    usuario: usuario,
                    total: conteo,
                });
            });
        });
});

/**
 * @swagger
 * /producto/{id}?desde={desde}:
 *  get:
 *      summary: Retorna el producto seleccionado
 *      tags: [Producto]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: Id del producto
 *          -   in: query
 *              name: desde
 *              schema:
 *                  type: number
 *              description: Numero desde donde empieza la paginacion
 *      responses:
 *          200:
 *              description: Lista de productos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                              productos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Producto'
 *                              proveedor:
 *                                  $ref: '#/components/schemas/Proveedor'
 *                              usuario:
 *                                  $ref: '#/components/schemas/Usuario'
 *                              total:
 *                                  type: number
 *          500:
 *              description: Error al buscar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.get("/:id", (req, res) => {
    var desde = req.params.desde || 0;
    var id = req.params.id;
    desde = Number(desde);

    Producto.findById(id)
        .skip(desde)
        .limit(15)
        .populate("proveedor", "nombre email telefono estado")
        .populate("usuario", "email")
        .exec((err, productos, proveedor, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando productos",
                    errors: err,
                });
            }
            Producto.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    productos: productos,
                    proveedor: proveedor,
                    usuario: usuario,
                    total: conteo,
                });
            });
        });
});

/**
 * @swagger
 * /producto:
 *  post:
 *      summary: Se crea un producto
 *      tags: [Producto]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Producto'
 *      responses:
 *          201:
 *              description: Producto creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  producto:
 *                                      $ref: '#/components/schemas/Cliente'
 *                                  productoToken:                         
 *                                      type: string
 *          400:
 *              description: Error al crear el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        img: body.img,
        stock: body.stock,
        precio: body.precio,
        proveedor: body.proveedor,
        estado: body.estado,
        usuario: body.usuario,
    });
    producto.save((err, productoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al generar producto",
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoGuardado,
            productoToken: req.producto,
        });
    });
});

/**
 * @swagger
 * /producto/{id}:
 *  put:
 *      summary: Se modifica un producto
 *      tags: [Producto]
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
 *                      $ref: '#/components/schemas/Producto'
 *      responses:
 *          200:
 *              description: Producto modificado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  producto:
 *                                      $ref: '#/components/schemas/Cliente'
 *          400:
 *              description: Error al actualizar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al buscar producto",
                errors: err,
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: "El producto con el ID" + id + " no existe",
                errors: { message: "No existe un producto con este ID" },
            });
        }
        producto.nombre = body.nombre;
        producto.stock = body.stock;
        producto.precio = body.precio;
        producto.proveedor = body.proveedor;
        producto.estado = body.estado;
        producto.usuario = body.usuario;
        const productoGuardado = Producto.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar producto",
                    errors: err,
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado,
            });
        });
    });
});

/**
 * @swagger
 * /producto/{id}:
 *  delete:
 *      summary: Se elimina un producto
 *      tags: [Producto]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: Id del Producto a eliminar
 *      responses:
 *          200:
 *              description: Pedido eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                  producto:
 *                                      $ref: '#/components/schemas/Cliente'
 *          400:
 *              description: Error al eliminar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Errors'
 */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al borrar producto",
                errors: err,
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un producto con este ID",
                errors: { message: "No existe un producto con este ID" },
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoBorrado,
        });
    });
});

module.exports = app;
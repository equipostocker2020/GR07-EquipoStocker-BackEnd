/**
 * @swagger
 * tags:
 *  name: Busqueda
 *  description: Endpoint para el ingreso de pedidos
 */

// requires
var express = require("express");
var app = express();
var Usuario = require("../models/usuario");
var Producto = require("../models/producto");
var Proveedor = require("../models/proveedor");
var Cliente = require("../models/cliente");
var Pedido = require("../models/pedido");

/**
 * @swagger
 * /coleccion/{tabla}/{busqueda}:
 *  get:
 *      summary: Busqueda por coleccion
 *      tags: [Busqueda]
 *      parameters:
 *          -   in: path
 *              name: tabla
 *              schema:
 *                  type: string
 *                  enum: ["usuarios", "productos", "proveedor", "cliente", "pedido"]
 *              required: true
 *              description: Coleccion a buscar
 *          -   in: path
 *              name: busqueda
 *              schema:
 *                  type: string
 *              required: true
 *              description: busqueda enviada
 *      responses:
 *          200:
 *              description: Tipo de objeto que se puede generar dependiendo de la consulta
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              oneOf:
 *                                  -   $ref: '#/components/schemas/Usuario'
 *                                  -   $ref: '#/components/schemas/Producto'
 *                                  -   $ref: '#/components/schemas/Proveedor'
 *                                  -   $ref: '#/components/schemas/Cliente'
 *                                  -   $ref: '#/components/schemas/Pedido'
 *          400:
 *              description: Error en la busqueda
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, "i");

    var promesa;

    switch (tabla) {
        case "usuarios":
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case "productos":
            promesa = buscarProductos(busqueda, regex);
            break;
        case "proveedor":
            promesa = buscarProveedor(busqueda, regex);
            break;
        case "cliente":
            promesa = buscarCliente(busqueda, regex);
            break;
        case "pedido":
            promesa = buscarPedido(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: "Error, la coleccion no es valida",
                error: { message: "Tipo de coleccion no valida" },
            });
    }
    promesa.then((data) => {
        res.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });
});

/**
 * @swagger
 * /todo/{busqueda}:
 *  get:
 *      summary: Busqueda general
 *      tags: [Busqueda]
 *      parameters:
 *          -   in: path
 *              name: busqueda
 *              schema:
 *                  type: string
 *              required: true
 *              description: Coleccion a buscar
 *      responses:
 *          200:
 *              description: Tipo de objeto que se puede generar dependiendo de la consulta
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  ok:
 *                                      type: boolean
 *                                  usuarios:
 *                                      $ref: '#/components/schemas/Usuario'
 *                                  productos:
 *                                      $ref: '#/components/schemas/Producto'
 *                                  proveedores:
 *                                      $ref: '#/components/schemas/Proveedor'
 *                                  cliente:
 *                                      $ref: '#/components/schemas/Cliente'
 *                                  pedido:
 *                                      $ref: '#/components/schemas/Pedido'
 *          400:
 *              description: Error en la busqueda
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
app.get("/todo/:busqueda", (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, "i");

    // guardo todas las promesas en un arreglo y
    // las hago asincronas para mapear todos los resultados

    Promise.all([
        buscarUsuarios(busqueda, regex, "usuario"),
        buscarProductos(busqueda, regex, "producto"),
        buscarProveedor(busqueda, regex, "proveedor"),
        buscarCliente(busqueda, regex, "cliente"),
        buscarPedido(busqueda, regex, "pedido"),
    ]).then((respuestas) => {
        res.status(200).json({
            ok: true,
            usuarios: respuestas[0],
            productos: respuestas[1],
            proveedores: respuestas[2],
            cliente: respuestas[3],
            pedido: respuestas[4],
        });
    });
});

// declaro funciones
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, "nombre email direccion empresa dni cuit role img")
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error al cargar usuarios", err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

function buscarProductos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Producto.find({ nombre: regex })
            .populate("proveedor", "nombre email telefono, img")
            .exec((err, productos) => {
                if (err) {
                    reject("Error al cargar productos", err);
                } else {
                    resolve(productos);
                }
            });
    });
}

function buscarProveedor(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Proveedor.find({},
                "nombre direccion cuit email telefono situacion_afip img "
            )
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, proveedor) => {
                if (err) {
                    reject("Error al cargar proveedor");
                } else {
                    resolve(proveedor);
                }
            });
    });
}

function buscarCliente(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Cliente.find({},
                "nombre apellido email cuit dni direccion img telefono dni"
            )
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, cliente) => {
                if (err) {
                    reject("Error al cargar cliente");
                } else {
                    resolve(cliente);
                }
            });
    });
}

function buscarPedido(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Pedido.find({ estado: regex })
            .populate("pedido", "cliente producto cantidad estado total numero_pedido Usuario")
            .populate("cliente", "nombre apellido email cuit dni direccion img telefono dni")
            .populate("producto", "nombre ")
            .populate("usuario", "mail ")
            .exec((err, pedido) => {
                if (err) {
                    reject("Error al cargar pedido", err);
                } else {
                    resolve(pedido);
                }
            });
    });
}

module.exports = app;
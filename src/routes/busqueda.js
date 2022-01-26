let express = require("express");
let app = express();
let Usuario = require("../models/usuarioModel");
let Producto = require("../models/productoModel");
let Proveedor = require("../models/proveedorModel");
let Cliente = require("../models/clienteModel");
let Pedido = require("../models/pedidoModel");

app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let regex = new RegExp(busqueda, "i");

    let promesa;

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

app.get("/todo/:busqueda", (req, res, next) => {
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, "i");

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
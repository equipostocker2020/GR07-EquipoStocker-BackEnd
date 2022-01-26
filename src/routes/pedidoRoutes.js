let express = require("express");
let app = express();
let Pedido = require("../models/pedidoModel");
let mdAutenticacion = require("../middlewares/autenticacion");
let Cliente = require("../models/cliente");
let Producto = require("../models/productoModel");
let Usuario = require("../models/usuarioModel");
const uuidv4 = require("uuidv4");

app.get("/", (req, res) => {
    let desde = req.params.desde || 0;
    desde = Number(desde);

    Pedido.find({}, " numero_pedido cantidad estado total")
        .skip(desde)
        .limit(15)
        .populate({ path: "producto", model: Producto })
        .populate({ path: "cliente", model: Cliente })
        .populate({ path: "usuario", model: Usuario })
        .exec((err, pedidos, clientes, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando pedido",
                    errors: err,
                });
            }
            Pedido.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    pedidos: pedidos,
                    clientes: clientes,
                    productos: productos,
                    total: conteo,
                });
            });
        });
});

app.get("/:id", (req, res) => {
    let desde = req.params.desde || 0;
    desde = Number(desde);
    let i = 0;
    let id = req.params.id;
    let pedido = [];
    conteo = 0;
    Pedido.findById(id, (err, pedido) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al buscar pedido",
                errors: err,
            });
        }
        if (!pedido) {
            return res.status(400).json({
                ok: false,
                mensaje: "El pedido con el ID" + id + " no existe",
                errors: { message: "No existe un pedido con este ID" },
            });
        }
        res.status(200).json({
            ok: true,
            pedido: pedido,
            total: conteo,
        });
    });
});

app.get("/cliente/:id", (req, res) => {
    let desde = req.params.desde || 0;
    desde = Number(desde);
    let i = 0;
    let id = req.params.id;
    let pedido = [];
    conteo = 0;

    Pedido.find({})
        .skip(desde)
        .limit(15)
        .populate({ path: "producto", model: Producto })
        .exec((err, pedidos, clientes, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando pedido con ese ID",
                    errors: err,
                });
            }
            for (i; i < pedidos.length; i++) {
                if (pedidos[i].cliente == id) {
                    pedido.push(pedidos[i]);
                    conteo = conteo + 1;
                }
            }
            res.status(200).json({
                ok: true,
                pedidos: pedido,
                clientes: clientes,
                productos: productos,
                total: conteo,
            });
        });
});

app.post("/", mdAutenticacion.verificaToken, (req, res) => {
    let body = req.body;
    let resta_producto = 0;

    let producto = Producto.findById(body.producto, (err, producto) => {
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
                mensaje: "El producto con el ID " + id + " no existe",
                errors: { message: "No existe un producto con este ID" },
            });
        }

        if (body.cantidad <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "La cantidad " + body.cantidad + " es menor o igual a 0",
                errors: { message: "No existe un pedido con este ID" },
            });
        }

        let idUnico = uuidv4();
        let numero_pedido = "P-" + idUnico;

        let pedido = new Pedido({
            numero_pedido: numero_pedido,
            cliente: body.cliente,
            producto: body.producto,
            cantidad: body.cantidad,
            estado: body.estado,
            total: producto.precio * body.cantidad,
            usuario: body.usuario,
        });

        if (producto.stock >= body.cantidad) {
            producto.stock = producto.stock - body.cantidad;
            producto.save(producto);
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: "El producto con la cantidad " + body.cantidad + " supera el stock",
                errors: { message: "La cantidad supera el stock" },
            });
        }

        pedido.save((err, pedidoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al generar pedido",
                    errors: err,
                });
            }
            res.status(200).json({
                ok: true,
                pedido: pedidoGuardado,
            });
        });
    });
});

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let cantidadAux = 0;
    Pedido.findById(id, (err, pedido) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al buscar pedido",
                errors: err,
            });
        }
        if (!pedido) {
            return res.status(400).json({
                ok: false,
                mensaje: "El pedido con el ID" + id + " no existe",
                errors: { message: "No existe un pedido con este ID" },
            });
        }
        if (pedido.estado != body.estado && body.estado != "cancelado") {
            pedido.estado = body.estado;
            const pedidoGuardado = Pedido.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            return pedido.save((pedidoGuardado) => {
                res.status(200).json({
                    ok: true,
                    pedido: pedidoGuardado,
                });
            });

        }
        if (body.cantidad <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "La cantidad " + body.cantidad + " es menor o igual a 0",
                errors: { message: "No existe un pedido con este ID" },
            });
        }

        Producto.findById(pedido.producto, (err, producto) => {
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
                    mensaje: "El producto con el ID " + id + " no existe",
                    errors: { message: "No existe un producto con este ID" },
                });
            }
            if (pedido.producto != body.producto) {

                Producto.findById(body.producto, (err, productoNuevo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "Error al buscar producto",
                            errors: err,
                        });
                    }
                    if (!productoNuevo) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "El producto con el ID " + id + " no existe",
                            errors: { message: "No existe un producto con este ID" },
                        });
                    }

                    if (productoNuevo.stock > body.cantidad && (body.estado == 'enviado' || body.estado == 'preparación')) {
                        productoNuevo.stock = productoNuevo.stock - body.cantidad;
                        productoNuevo.save(productoNuevo);
                        producto.stock = producto.stock + pedido.cantidad;
                        producto.save(producto);

                    } else if (pedido.cantidad < body.cantidad && (body.estado == 'enviado' || body.estado == 'preparación')) {
                        productoNuevo.stock = productoNuevo.stock - body.cantidad;
                        productoNuevo.save(productoNuevo);
                        producto.stock = producto.stock + pedido.cantidad;
                        producto.save(producto);

                    } else if (pedido.cantidad == body.cantidad && (body.estado == 'enviado' || body.estado == 'preparación')) {
                        pedido.cliente = body.cliente;
                    } else if (body.estado == 'cancelado') {
                        productoNuevo.stock = productoNuevo.stock + pedido.cantidad;
                        productoNuevo.save(productoNuevo);
                    } else {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "El producto con la cantidad " + body.cantidad + " supera el stock",
                            errors: { message: "La cantidad supera el stock" },
                        });
                    }

                    pedido.cliente = body.cliente;
                    pedido.producto = body.producto;
                    pedido.cantidad = body.cantidad;
                    pedido.estado = body.estado;
                    pedido.total = productoNuevo.precio * body.cantidad;
                    pedido.usuario = body.usuario;
                    const pedidoGuardado = Pedido.findByIdAndUpdate(id, req.body, {
                        new: true,
                    });

                    pedido.save((err, pedidoGuardado) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: "Error al actualizar producto",
                                errors: err,
                            });
                        }
                        res.status(200).json({
                            ok: true,
                            pedido: pedidoGuardado,
                        });
                    });
                });
            } else {
                if (producto.stock > body.cantidad && (body.estado == 'enviado' || body.estado == 'preparación')) {
                    if (pedido.cantidad < body.cantidad) {
                        cantidadAux = body.cantidad - pedido.cantidad;
                        producto.stock = producto.stock - cantidadAux;
                        producto.save(producto);
                    } else if (body.cantidad < pedido.cantidad && (body.estado == 'enviado' || body.estado == 'preparación')) {
                        cantidadAux = pedido.cantidad - body.cantidad;
                        producto.stock = producto.stock + cantidadAux;
                        producto.save(producto);

                    } else if (pedido.cantidad == body.cantidad && (body.estado == 'enviado' || body.estado == 'preparación')) {
                        pedido.cliente = body.cliente;
                    } else if (body.estado == 'cancelado') {
                        producto.stock = producto.stock + pedido.cantidad;
                        producto.save(producto);
                    } else {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "El producto con la cantidad " + body.cantidad + " supera el stock",
                            errors: { message: "La cantidad supera el stock" },
                        });
                    }
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "El producto con la cantidad " + body.cantidad + " supera el stock",
                        errors: { message: "La cantidad supera el stock" },
                    });
                }

                pedido.cliente = body.cliente;
                pedido.producto = body.producto;
                pedido.cantidad = body.cantidad;
                pedido.estado = body.estado;
                pedido.total = producto.precio * body.cantidad;
                pedido.usuario = body.usuario;
                const pedidoGuardado = Pedido.findByIdAndUpdate(id, req.body, {
                    new: true,
                });

                pedido.save((err, pedidoGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "Error al actualizar producto",
                            errors: err,
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        pedido: pedidoGuardado,
                    });
                });
            }
        });
    });
});

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Pedido.findById(id, (err, pedido) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al buscar pedido",
                errors: err,
            });
        }
        if (!pedido) {
            return res.status(400).json({
                ok: false,
                mensaje: "El pedido con el ID" + id + " no existe",
                errors: { message: "No existe un pedido con este ID" },
            });
        }
        Producto.findById(pedido.producto, (err, producto) => {
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
                    mensaje: "El producto con el ID " + id + " no existe",
                    errors: { message: "No existe un producto con este ID" },
                });
            }
            producto.stock = producto.stock + pedido.cantidad;
            producto.save(producto);
        });
    });

    Pedido.findByIdAndRemove(id, (err, pedidoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al borrar pedido",
                errors: err,
            });
        }
        if (!pedidoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un pedido con este ID",
                errors: { message: "No existe un pedido con este ID" },
            });
        }
        res.status(200).json({
            ok: true,
            pedido: pedidoBorrado,
        });
    });
});

module.exports = app;
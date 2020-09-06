var express = require("express");
var app = express();
var Pedido = require("../models/pedido");
var mdAutenticacion = require("../middlewares/autenticacion");
const Cliente = require("../models/cliente");
var Producto = require("../models/producto");


app.get("/", (req, res) => {
    var desde = req.params.desde || 0;
    desde = Number(desde);

    Pedido.find({}, " numero_pedido cantidad estado total")
        .skip(desde)
        .limit(15)
        .populate({path: 'producto', model: Producto})
        .populate({path: 'cliente', model: Cliente})
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
                    total: conteo
                });
            });
        });
});

app.get("/:id", (req, res) => {
    var desde = req.params.desde || 0;
    desde = Number(desde);

    let i = 0
    var id = req.params.id;
    let pedido = [];
    conteo = 0;

    Pedido.find({})
    .exec((err, pedidos, clientes, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando pedido con ese ID",
                errors: err,
            });
        }
        if (!pedidos) {
            return res.status(400).json({
                ok: false,
                mensaje: "El pedido con el ID" + id + " no existe",
                errors: { message: "No existe un producto con este ID" },
            });
        }
        console.log(pedidos.length)
        for(i ; i < pedidos.length; i++){
        if(pedidos[i].cliente == id){
            pedido.push(pedidos[i])
            conteo = conteo + 1;
        }
    }
    res.status(200).json({
        ok: true,
        pedidos: pedido,
        clientes: clientes,
        productos: productos,
        total: conteo
    });    
    });

});



app.post("/", (req, res) => {
    var body = req.body;
    var resta_producto = 0;
    
    var producto = Producto.findById(body.producto, (err, producto) => {
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

        var pedidofalso = new Pedido({estado: body.estado});

        var pedido = new Pedido({
            numero_pedido : "P-" + pedidofalso._id,
            cliente: body.cliente,
            producto: body.producto,
            cantidad: body.cantidad,
            estado: body.estado,
            total: producto.precio * body.cantidad,
        });

        
        if(producto.stock > body.cantidad){
        producto.stock = producto.stock - body.cantidad;
        producto.save(producto);
        }else{
            return res.status(400).json({
                ok: false,
                mensaje: "El producto con la cantidad" + body.cantidad + " supera el stock",
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


module.exports = app;
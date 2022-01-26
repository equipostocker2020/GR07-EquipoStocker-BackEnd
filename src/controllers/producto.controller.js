let Producto = require("../models/producto.model");

const getProducto = (req, res) => {
    let desde = req.params.desde || 0;
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
};

const getProductoById = (req, res) => {
    let desde = req.params.desde || 0;
    let id = req.params.id;
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
};

const addProducto = (req, res) => {
    let body = req.body;

    let producto = new Producto({
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
};

const updateProducto = (req, res) => {
    let id = req.params.id;
    let body = req.body;
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
};

const deleteProducto = (req, res) => {
    let id = req.params.id;
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
};

module.exports = { getProducto, getProductoById, addProducto, updateProducto, deleteProducto };
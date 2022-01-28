let Proveedor = require("../models/proveedor.model");

const getProveedor = (req, res) => {
    let desde = req.query.desde || 0;
    Proveedor.find({}, "nombre direccion cuit email telefono situacion_afip img estado")
        .skip(desde)
        .limit(15)
        .populate("usuario", "email")
        .exec((err, proveedor, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando proveedor",
                    errors: err,
                });
            }
            Proveedor.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    proveedor: proveedor,
                    usuario: usuario,
                    total: conteo,
                });
            });
        });
};

const postProveedor = (req, res) => {
    let body = req.body;
    let proveedor = new Proveedor({
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
    proveedor.save((err, proveedorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear proveedor",
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            proveedor: proveedorGuardado,
            proveedorToken: req.proveedores,
        });
    });
};

const updtProveedor = (req, res) => {
    let id = req.params.id;
    let body = req.body;

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
};

const deleteProveedor = (req, res) => {
    let id = req.params.id;
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
};

module.exports = {deleteProveedor, updtProveedor, postProveedor, getProveedor};
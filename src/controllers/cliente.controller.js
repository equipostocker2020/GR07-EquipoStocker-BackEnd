let Cliente = require("../models/cliente.model");

const getClientes = (req, res) => {
    let desde = req.query.desde || 0;
    Cliente.find({}, "nombre apellido email direccion cuit telefono dni img estado")
        .skip(desde)
        .limit(15)
        .populate("usuario", "email")
        .exec((err, clientes, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando clientes",
                    errors: err,
                });
            }
            Cliente.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    clientes: clientes,
                    usuario_modifica: usuario,
                    total: conteo,
                });
            });
        });
};

const addCliente = (req, res) => {
    let body = req.body;

    let cliente = new Cliente({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        direccion: body.direccion,
        cuit: body.cuit,
        telefono: body.telefono,
        dni: body.dni,
        img: body.img,
        usuario: body.usuario,
        estado: body.estado,
    });

    cliente.save((err, clienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario",
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            cliente: clienteGuardado,
            clienteToken: req.cliente,
        });
    });
};

const updateClienteById = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Cliente.findById(id, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar cliente",
                errors: err,
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: "El cliente con el ID" + id + " no existe",
                errors: { message: " No existe un cliente con ese ID" },
            });
        }

        cliente.nombre = body.nombre;
        cliente.apellido = body.apellido;
        cliente.email = body.email;
        cliente.direccion = body.direccion;
        cliente.cuit = body.cuit;
        cliente.telefono = body.telefono;
        cliente.dni = body.dni;
        cliente.usuario = body.usuario;
        cliente.estado = body.estado;

        cliente.save((err, clienteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar cliente",
                    errors: err,
                });
            }
            clienteGuardado.password = "=)";

            res.status(200).json({
                ok: true,
                usuario: clienteGuardado,
            });
        });
    });
};

const deleteCliente = (req, res) => {
    let id = req.params.id;
    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar cliente",
                errors: err,
            });
        }

        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un cliente con este ID",
                errors: { message: "No existe un cliente con este ID" },
            });
        }

        res.status(200).json({
            ok: true,
            cliente: clienteBorrado,
        });
    });
};

module.exports = { getClientes, addCliente, updateClienteById, deleteCliente };
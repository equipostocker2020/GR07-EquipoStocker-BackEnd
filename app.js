// requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//importar rutas
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");
var proveedoresRoutes = require("./routes/proveedor");
var productosRoutes = require("./routes/producto");
var clienteRoutes = require("./routes/cliente");
var PedidoRoutes = require("./routes/pedido");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload");
var imagenesRoutes = require("./routes/imagenes");

//inicializando
var app = express();

// enconding, verbos y metodos soportados..
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin,X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request, Method"
    );
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
//Body Parser
//parse application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// conexion a la BD.
mongoose.connection.openUri("mongodb://localhost:27017/stocker", (err, res) => {
    if (err) throw err;
    console.log("Base de datos\x1b[32m%s\x1b[0m ", " Stocker online");
});

//rutas
app.use("/login", loginRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/proveedor", proveedoresRoutes);
app.use("/producto", productosRoutes);
app.use("/cliente", clienteRoutes);
app.use("/pedido", PedidoRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/img", imagenesRoutes);
app.use("/upload", uploadRoutes);

// escuchando peticiones
app.listen(3000, () => {
    console.log(
        "Express server corriendo en el puerto 3000:\x1b[32m%s\x1b[0m ",
        " Stocker online"
    );
});
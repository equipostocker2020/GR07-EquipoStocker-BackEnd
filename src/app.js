// requires
let express = require("express");
let bodyParser = require("body-parser");
let swaggerUi = require("swagger-ui-express");
const cors = require('cors');

//importar rutas
let usuarioRoutes = require("./routes/usuario.route");
let loginRoutes = require("./routes/login.route");
let proveedoresRoutes = require("./routes/proveedor.route");
let productosRoutes = require("./routes/producto.route");
let clienteRoutes = require("./routes/cliente.route");
let PedidoRoutes = require("./routes/pedido.route");
let busquedaRoutes = require("./routes/busqueda.route");
let uploadRoutes = require("./routes/upload.route");
let imagenesRoutes = require("./routes/imagen.route");
let sendEmail = require("./routes/sendEmail");
let { swaggerDocs } = require("./config/swagger.config");

//inicializando
let app = express();
require("./config/database");

// enconding, verbos y metodos soportados..
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Body Parser
//parse application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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
app.use("/send-email", sendEmail);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// escuchando peticiones
app.listen(3000, () => {
    console.log(
        "Express server corriendo en el puerto 3000:\x1b[32m%s\x1b[0m ",
        " Stocker online"
    );
});

module.exports = app;
// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

const router = require('express').Router();

//importar rutas
var usuarioRoutes = require('./routes/usuario');

//inicializando
var app = express();

// enconding, verbos y metodos soportados..
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request, Method");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

//Body Parser
//parse application 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(fileUpload());

// conexion a la BD.
mongoose.connection.openUri('mongodb://localhost:27017/stocker', (err, res) => {

    if (err) throw err;
    console.log('Base de datos\x1b[32m%s\x1b[0m ', ' Stocker online');
});

//rutas
app.use('/usuario', usuarioRoutes);


// escuchando peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000:\x1b[32m%s\x1b[0m ', ' Stocker online');
})
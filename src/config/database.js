var mongoose = require("mongoose");

// conexion a la BD.
mongoose.connection.openUri("mongodb://localhost:27017/stocker",  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(console.log("Base de datos\x1b[32m%s\x1b[0m ", " Stocker online"))
.catch(error => console.log(error))
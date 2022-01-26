const path = require("path");
const fs = require("fs");

//traigo la imagen segun el "tipo de coleccion" enviando por params el nombre de la imagen
//previamente habiendolo manipulado y generado con uui.
const getImage = (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../assets/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, "../assets/blank-profile.png");
        res.sendFile(pathNoImage);
    }
};

module.exports = { getImage };
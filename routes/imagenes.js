//requires
var express = require("express");
var app = express();
const path = require("path");
const fs = require("fs");

//traigo la imagen segun el "tipo de coleccion" enviando por params el nombre de la imagen
//previamente habiendolo manipulado y generado con uui.
/**
 * @swagger
 * /imgs/{tipo}/{img}:
 *  get:
 *      summary: Retorna la imagen indicada
 *      tags: [Upload]
 *      parameters:
 *          -   in: path
 *              name: tipo
 *              schema:
 *                  type: string
 *              required: true
 *              description: Tipo de imagen
 *          -   in: path
 *              name: img
 *              schema:
 *                  type: string
 *              required: true
 *              description: Id de la imagen
 *      responses:
 *          200:
 *              description: Lista de clientes
 *              content:
 *                  image/png:
 *                      schema:
 *                          items:
 *                              type: string
 *                              format: binary
 *          500:
 *              description: Error al encontrar la imagen
 */
app.get("/:tipo/:img", (req, res) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../assets/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, "../assets/blank-profile.png");
        res.sendFile(pathNoImage);
    }
});

module.exports = app;
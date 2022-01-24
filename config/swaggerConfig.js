const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Documentacion API de Stocker",
            description: "Documentacion de los endpoints expuestos para consumo",
            contact: {
                name: "Stocker APP",
                url: "Htt:link de github"
            },
        },
        servers: [
            {
                url: "http://localhost:3000/"
            }
        ]
    },
    apis: [
        "./routes/*",
        "./models/*"
    ]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {swaggerDocs};
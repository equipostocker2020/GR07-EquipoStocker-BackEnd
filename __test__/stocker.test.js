const request = require("supertest");
const { app } = require("../app");
var assert = require('assert');
var mdAutenticacion = require("../middlewares/autenticacion");
const proveedor = require("../models/proveedor");
const cliente = require("../models/cliente");

// var token = req.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0";

/*
 * Test login.
 */

describe("POST /login", () => {
    test("Intenta traer un token, al estar mal armada la request devuelve un 400 - Bad Request.", async() => {

        await request(app)
            .post("/login")
            .set("Accept", "application/json")
            .send({
                email: "admin@admin",
                contraseña: "123456"
            })
            .expect("Content-Type", /json/)
            .expect(400);
    });
});

/**
 * Get Clientes
 */

describe("GET /cliente", () => {
    test("Obtiene la coleccion de clientes", async() => {
        const response = await request(app)
            .get("/cliente")
            .set("Accept", "application/json")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0",
                nombre: "cliente",
                apellido: "Test",
                email: "",
            })
            .expect("Content-Type", /json/)
            .expect(200);

        const clientes = response.body.clientes[0];

        assert.equal(clientes.estado, "ACTIVO");
    });
});


/**
 * Post clientes Bad Request
 */

describe("POST /cliente", () => {
    test("Trata de crear un cliente, devuelve 400 dado que no se envian datos como email, dni, etc.", async() => {
        const response = await request(app)
            .post("/cliente?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0.YZGg3M5L_V9Fds6uz8ikH6YfE9JE0PAv7pLRNiLojYM")
            .send({
                nombre: "cliente",
                apellido: "Test",
                email: "",
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400);

        assert.equal(response.body.mensaje, "Error al crear usuario");
        assert.equal(response.body.ok, false);
    });
});

/**
 * Put clientes Bad Request
 */

describe("PUT /cliente", () => {
    test("Trata de crear un cliente, devuelve 401 - Forbidden.", async() => {
        const response = await request(app)
            .put("/cliente/5f46b27de5f7ce3ce612da41?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0",
                id: "5f46b27de5f7ce3ce612da41",
                nombre: "cliente",
                apellido: "Teste",
                email: "",
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.error.name, "Error");
        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});


/**
 * DELETE clientes Bad Request
 */

describe("DELETE /cliente", () => {
    test("Trata de crear un cliente, devuelve 401 - Forbidden.", async() => {
        const response = await request(app)
            .delete("/cliente/5f46b27de5f7ce3ce612da41?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0",
                id: "5f46b27de5f7ce3ce612da41",
                nombre: "cliente",
                apellido: "Test",
                email: "",
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});


/**
 * GET USUARIO
 */

describe("GET /usuario", () => {
    test("Obtiene toda la coleccion de usuarios", async() => {
        const response = await request(app)
            .get("/usuario")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const usuarios = response.body.usuarios[0];

        assert.equal(usuarios.role, "ADMIN_ROLE");
    });
});

/**
 * POST USUARIO
 */

describe("POST /usuario", () => {
    test("Trata de crear un usuario, devuelve 400 dado que no se envian datos como email, dni, etc.", async() => {
        const response = await request(app)
            .post("/usuario")
            .send({
                nombre: "cliente",
                apellido: "Test",
                email: "",
                password: "123"
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400);

        assert.equal(response.body.mensaje, "Error al crear usuario");
        assert.equal(response.body.ok, false);
    });
});

/**
 * DELETE USUARIO
 */

describe("DELETE /usuario", () => {
    test("Se intenta eliminar un usuario, el servicio devuelve 401 - Forbidden", async() => {
        const response = await request(app)
            .delete("/usuario/5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0"
            })
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/**
 * PUT USUARIO
 */

describe("PUT /usuario", () => {
    test("Se intenta actualizar un usuario, el servicio devuelve 401 - Forbidden", async() => {
        const response = await request(app)
            .put("/usuario/5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0"
            })
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});


/**
 * PUT PRODUCTO
 */

describe("PUT /producto", () => {
    test("Trata de actualizar un producto, devuelve 401 - Forbidden.", async() => {
        const response = await request(app)
            .put("/producto//5f709f86e75a7400243ca9da")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZjI5ZTFmNDdjZTZlYzc1NDVkYmU1OTIiLCJub21icmUiOiJNYXJjZWxvIiwiYXBlbGxpZG8iOiJHdXRpZXJyZXoiLCJlbXByZXNhIjoiU2FyYXNhIiwiZGlyZWNjaW9uIjoicmVtczMwMjkiLCJjdWl0IjoiMTIzMTMyNDU2NDg5Nzk3IiwiZG5pIjoiMTIzNDU2Nzg5OTg3IiwidGVsZWZvbm8iOiIxMjM0NTY3ODkiLCJlbWFpbCI6Im1hcmNlbG9AbWFyY2Vsby5jb20iLCJwYXNzd29yZCI6Ij0pIiwiX192IjowLCJpbWciOiIzYTJkZjg2OS02YzQ5LTRhZDUtYWRkMC1mYTEyN2MzNzYxNzYuanBlZyJ9LCJpYXQiOjE1OTg0NjgyNDEsImV4cCI6MTU5ODQ4MjY0MX0"
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/**
 * GET PRODUCTO
 */

describe("GET /producto", () => {
    test("Obtiene toda la coleccion de productos", async() => {
        const response = await request(app)
            .get("/producto")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const productos = response.body.productos[0];
        const proveedores = response.body.productos[0].proveedor;

        assert.equal(productos.estado, "ACTIVO");
        assert.equal(proveedores.estado, "ACTIVO");
    });
});

/**
 * POST Producto
 */

describe("POST /producto", () => {
    test("Intenta crear un producto. Devuelve un 401 - Forbidden", async() => {
        const response = await request(app)
            .post("/producto")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/**
 * DELETE Producto
 */

describe("DELETE /producto", () => {
    test("Se intenta eliminar un producto, el servicio devuelve 401 - Forbidden", async() => {
        const response = await request(app)
            .delete("/producto/5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
GET clientes.
*/

describe("GET /cliente", () => {
    test("Obtiene toda la coleccion de clientes", async() => {
        const response = await request(app)
            .get("/cliente")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const clientes = response.body.clientes[0];

        assert.equal(clientes.estado, "ACTIVO");
    });
});

/*
PUT clientes.
*/

describe("PUT /cliente", () => {
    test("Trata de actualizar un cliente, devuelve 401 - Forbidden.", async() => {
        const response = await request(app)
            .put("/cliente//5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);


        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
POST clientes.
*/

describe("POST /cliente", () => {
    test("Intenta crear un cliente. Devuelve un Bad request dado qeu se no se envia ningun dato. ", async() => {
        const response = await request(app)
            .post("/cliente")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400);

        assert.equal(response.body.mensaje, "Error al crear usuario");
        assert.equal(response.body.ok, false);
    });
});

/*
DELETE clientes.
*/

describe("DELETE /cliente", () => {
    test("Se intenta eliminar un cliente, el servicio devuelve 401 - Forbidden", async() => {
        const response = await request(app)
            .delete("/cliente/5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
GET Proveedor.
*/

describe("GET /proveedor", () => {
    test("Obtiene toda la coleccion de proveedores", async() => {
        const response = await request(app)
            .get("/proveedor")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const proveedores = response.body.proveedor[0];

        assert.equal(proveedores.estado, "ACTIVO");
    });
});

/*
PUT Proveedor.
*/

describe("PUT /proveedor", () => {
    test("Trata de actualizar un proveedor, devuelve 401 - Forbidden.", async() => {
        const response = await request(app)
            .put("/proveedor//5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);

    });
});

/*
POST Proveedor.
*/

describe("POST /proveedor", () => {
    test("Intenta crear un proveedor. Devuelve un 401 - Forbidden", async() => {
        const response = await request(app)
            .post("/proveedor")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
DELETE Proveedor.
*/

describe("DELETE /proveedor", () => {
    test("Se intenta eliminar un proveedor, el servicio devuelve 401 - Forbidden", async() => {
        const response = await request(app)
            .delete("/proveedor/5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
GET Pedidos.
*/

describe("GET /pedido", () => {
    test("obtiene toda la coleccion de pedidos", async() => {
        const response = await request(app)
            .get("/proveedor")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const pedidos = response.body.proveedor[0];

        assert.equal(pedidos.estado, "ACTIVO");
    });
});

/*
PUT Pedidos.
*/

describe("PUT /pedido", () => {
    test("Trata de actualizar un pedido, devuelve 401 Forbidden.", async() => {
        const response = await request(app)
            .put("/pedido//5f709f86e75a7400243ca9da")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
POST Pedidos.
*/

describe("POST /pedido", () => {
    test("Intenta crear un pedido. Devuelve un 401 - Forbidden", async() => {
        const response = await request(app)
            .post("/pedido")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401);

        assert.equal(response.body.mensaje, "Token");
        assert.equal(response.body.ok, false);
    });
});

/*
GET busqueda general.
*/

describe("GET /todo/:busqueda", () => {
    test("Obtiene el resultado de una busqueda general en todas las colecciones.", async() => {
        const response = await request(app)
            .get("/busqueda/todo/a")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const usuarios = response.body.usuarios[0];
        assert.equal(usuarios.role, "ADMIN_ROLE");
    });
});

/*
GET busqueda por coleccion.
*/

describe("GET /coleccion/:tabla/:busqueda", () => {
    test("Obtiene el resultado de una busqueda en la coleccion usuarios, filtrando por la 'a' .", async() => {
        const response = await request(app)
            .get("/busqueda/coleccion/usuarios/a")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        const usuarios = response.body.usuarios[0];
        assert.equal(usuarios.role, "ADMIN_ROLE");
    });
});

/*
GET Imagen.
*/

describe("GET /:tipo/:img", () => {
    test("Obtiene una imagen especifica, en este caso de la coleccion proveedor.", async() => {
        const response = await request(app)
            .get("/upload/proveedores/8600c6f4-7b36-4e48-b7ea-27f3b41f163f.jpeg")
            .set("Accept", "application/json")
            .expect("Content-Type", "image/jpeg")
            .expect(200);

        assert.equal(response.body.offset, 0);
    });
});

/*
PUT Imagen.
*/

describe("PUT /:tipo/:id", () => {
    test("Actualiza la imagen de un registro. En este caso un proveedor. Devuelve Bad Request al no agregar un archivo al como form-data", async() => {
        const response = await request(app)
            .put("/upload/proveedores/5f089ae04be48c10a60b235f")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400);

        assert.equal(response.body.mensaje, "No selecciono ninguna imagen");
        assert.equal(response.body.ok, false);
    });
});
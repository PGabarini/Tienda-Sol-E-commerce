import { clearDb, closeDb, openDb } from "./testDb.js";
import application from "../src/app/application.js";
import request from "supertest";
import dataset from "./dataset.json" with {type: "json"};
import UserSchema from "../src/models/repositories/mongoSchemas/usuarioSchema.js";
import usuarioSchema from "../src/models/repositories/mongoSchemas/usuarioSchema.js";
import ProductoSchema from "../src/models/repositories/producto/productoSchema.js";

let app;

beforeAll(async () => {
  await openDb();
  app = await application();
}, 6000);

afterEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await closeDb();
});
/*
test("Crear usuario", async () => {
  const user = dataset.usuarios[0];

  const response = await request(app)
    .post("/usuarios")
    .send(user);

  expect(response.statusCode).toBe(201);
  expect(response.body.nombre).toBe(user.nombre);

  const persisted = await UserSchema.findOne({ nombre: user.nombre });

  expect(persisted._id.toString()).toBe(response.body.id);
});

test("No crear usuario con email repetido", async () => {
  const user = dataset.usuarios[0];

  await usuarioSchema.create(user);

  const response = await request(app)
    .post("/usuarios")
    .send({ ...user, nombre: "Otro nombre" });

  expect(response.statusCode).toBe(409);
});

test("Usuario sin pedidos retorna array vacío", async () => {
  const user = await usuarioSchema.create(dataset.usuarios[0]);

  const response = await request(app)
    .get(`/usuarios/${user._id}/pedidos`)
    .send();

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(0);
});
*/
/*
test("Usuario con pedidos retorna historial", async () => {
  const comprador = await usuarioSchema.create(dataset.usuarios[0]);
  const compradorId = comprador._id.toString();

  const vendedor = await usuarioSchema.create(dataset.usuarios[1]);

  const productoData = { ...dataset.productos[0], vendedor: vendedor._id };
  const producto = await ProductoSchema.create(productoData);

  const pedidoData = {
    ...dataset.pedidos[0],
    compradorId: compradorId,
    items: [{ productoId: producto._id, cantidad: 2 }],
    total: producto.precio * 2,
};
  await request(app)
    .post("/pedidos")
    .send(pedidoData);


  const historialRes = await request(app)
    .get(`/usuarios/${compradorId}/pedidos`)
    .send();

  expect(historialRes.statusCode).toBe(200);
  expect(historialRes.body.length).toBe(1);
  expect(historialRes.body[0]).toMatchObject({
    comprador: compradorId,
    moneda: "REAL",
    items: expect.any(Array),
    total: pedidoData.total
  });
});
*/

test("Usuario no encontrado al pedir historial de pedidos", async () => {
  const response = await request(app)
    .get(`/usuarios/64b64c4f5311236168a109ca/pedidos`)
    .send();

  expect(response.statusCode).toBe(404);
});

test("Usuario debe cumplir formato", async()=>{

  const user = {...dataset.usuarios[0],telefono: "hola"}
  
  const response = await request(app)
    .post("/usuarios")
    .send(user);
  

  expect(response.statusCode).toBe(400);

})

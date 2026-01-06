import request from "supertest";
import appModule from "../src/app/application.js";
import { clearDb, closeDb, openDb } from "./testDb.js";
import dataset from "./dataset.json";
import pedidoSchema from "../src/models/repositories/mongoSchemas/pedidoSchema.js";
import productoSchema from "../src/models/repositories/producto/productoSchema.js";
import usuarioSchema from "../src/models/repositories/mongoSchemas/usuarioSchema.js";

let app;
let compradorID;
let vendedorID;
let pedidoID;
let productoID;

beforeAll(async () => {
  await openDb();
  app = await appModule();
}, 60000);

beforeEach(async () => {
  const comprador = await usuarioSchema.create(dataset.usuarios[0])
  const vendedor = await usuarioSchema.create(dataset.usuarios[1])
  compradorID = comprador._id.toString();
  vendedorID = vendedor._id.toString();

  const producto = await productoSchema.create({
    ...dataset.productos[0],
    vendedor: vendedorID,
  });
  productoID = producto._id.toString();

  const pedido = await request(app).post("/pedidos").send({
    ...dataset.pedidos[0],
    compradorId: compradorID,
    items: [{ productoId: productoID, cantidad: 2 }],
  });

  pedidoID = pedido.body._id;
});

afterEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await closeDb();
});

test("Debería devolver todos los pedidos", async () => {
  const res = await request(app).get("/pedidos");
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].comprador?._id?.toString()).toBe(compradorID);
});

test("Debería crear un nuevo pedido", async () => {
  const nuevoPedido = {
    compradorId: compradorID,
    items: [{ productoId: productoID, cantidad: 2 }],
    moneda: "REAL",
    direccionEntrega: {
      calle: "Calle Falsa",
      altura: "123",
      piso: "1",
      departamento: "A",
      ciudad: "Ciudad Ejemplo",
      codPostal: "1000",
      provincia: "Provincia Ejemplo",
      pais: "BRASIL",
      lat: -34.6037,
      lon: -58.3816
    }
  };

  const res = await request(app).post("/pedidos").send(nuevoPedido);

  expect(res.statusCode).toBe(201);
  expect(res.body).toMatchObject({
    comprador: compradorID, 
    items: expect.any(Array),
    moneda: "REAL",
  });

  const pedidoEnDb = await pedidoSchema.findById(res.body._id);
  expect(pedidoEnDb).not.toBeNull();
  expect(pedidoEnDb.comprador.toString()).toBe(compradorID);
});

test("Debería devolver 404 si el pedido no existe", async () => {
  const res = await request(app).get("/pedidos/66ffaaaa0000000000000000");
  expect(res.statusCode).toBe(404);
});

test("Cancelar Pedido antes de que sea enviado", async () => {
  await request(app).delete(`/pedidos/${pedidoID}`);
  const pedido = await pedidoSchema.findById(pedidoID);
  expect(pedido.estado).toBe("CANCELADO");
});

test("Marcado de un pedido como enviado por parte del vendedor.", async () => {
  await request(app).post(`/pedidos/${pedidoID}/envios`);
  const pedido = await pedidoSchema.findById(pedidoID);
  expect(pedido.estado).toBe("ENVIADO");
});
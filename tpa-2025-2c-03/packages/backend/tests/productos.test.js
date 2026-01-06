import request from "supertest";
import appModule from "../src/app/application.js";
import { closeDb, openDb } from "./testDb.js";
import productoSchema from "../src/models/repositories/producto/productoSchema.js";
import usuarioSchema from "../src/models/repositories/mongoSchemas/usuarioSchema.js";

let app;
let vendedor1Id
let nombre = "Laptop Gamer XT300";
let categoria = "Computación";
let descripcion = "Laptop con procesador i7, 16GB RAM y tarjeta gráfica RTX 3060";
let precioDesde = 20;
let precioHasta = 100;
let dataset = require("./dataset.json");
let productos

beforeAll(async () => {
  await openDb();
  app = await appModule();
  const vendedor1 = await usuarioSchema.create(dataset.usuarios[1])
  vendedor1Id = vendedor1._id.toString();
  const vendedor2 = await usuarioSchema.create(dataset.usuarios[2])
  const vendedor2Id = vendedor2._id.toString();
  productos = dataset.productos.map(producto => {
    if (producto.vendedor === "1") {
      return { ...producto, vendedor: vendedor1Id };
    }
    if (producto.vendedor === "2") {
      return { ...producto, vendedor: vendedor2Id };
    }
    return producto;
  })

  await Promise.all(productos.map(producto => productoSchema.create(producto)));
}, 60000);



afterAll(async () => {
  await closeDb();
});

test("Devuelve todos los productos del vendedor 1", async () => {
  const res = await request(app).get(`/vendedor/${vendedor1Id}/productos`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(p => p.vendedor === vendedor1Id).length
  );
});

test("Filtra por nombre los productos del vendedor 1", async () => {
  const res = await request(app).get(`/vendedor/${vendedor1Id}/productos?nombre=${nombre}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(p => p.vendedor === vendedor1Id && p.titulo === nombre).length
  );
});

test("Filtra por categoria los productos del vendedor 1", async () => {
  const res = await request(app).get(`/vendedor/${vendedor1Id}/productos?categoria=${categoria}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(p => p.vendedor === vendedor1Id && p.categorias.includes(categoria)).length
  );
});

test("Filtra por descripcion los productos del vendedor 1", async () => {
  const res = await request(app).get(`/vendedor/${vendedor1Id}/productos?descripcion=${descripcion}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(p => p.vendedor === vendedor1Id && p.descripcion === descripcion).length
  );
});

test("Filtra por precioDesde los productos del vendedor 1", async () => {
  const res = await request(app).get(`/vendedor/${vendedor1Id}/productos?precioDesde=${precioDesde}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(p => p.vendedor === vendedor1Id && p.precio >= precioDesde).length
  );
});

test("Filtra por precioHasta los productos del vendedor 1", async () => {
  const res = await request(app).get(`/vendedor/${vendedor1Id}/productos?precioHasta=${precioHasta}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(p => p.vendedor === vendedor1Id && p.precio <= precioHasta).length
  );
});

test("Filtra por todos los criterios los productos del vendedor 1", async () => {
  const res = await request(app)
    .get(`/vendedor/${vendedor1Id}/productos`)
    .query({ nombre, categoria, descripcion, precioDesde, precioHasta });

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(
    productos.filter(
      p =>
        p.vendedor === vendedor1Id &&
        p.titulo === nombre &&
        p.categorias.includes(categoria) &&
        p.descripcion === descripcion &&
        p.precio >= precioDesde &&
        p.precio <= precioHasta
    ).length
  );
});

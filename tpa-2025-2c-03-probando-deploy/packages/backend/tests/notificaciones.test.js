
import notificacionSchema from "../src/models/repositories/mongoSchemas/notificacionSchema"
import application from "../src/app/application.js";
import { clearDb, closeDb, openDb } from "./testDb"
import request from "supertest";
import dataset from "./dataset.json" with { type: "json" };
import pedidoSchema from "../src/models/repositories/mongoSchemas/pedidoSchema.js";
import productoSchema from "../src/models/repositories/producto/productoSchema.js";
import usuarioSchema from "../src/models/repositories/mongoSchemas/usuarioSchema.js";

let app
let compradorID
let vendedorID
let pedidoID

beforeAll(async () => {
  await openDb();
  app = await application();

},60000)

beforeEach(async () => {

  const comprador = await usuarioSchema.create(dataset.usuarios[0]);
  const vendedor = await usuarioSchema.create(dataset.usuarios[1]);

  vendedorID = vendedor._id.toString();
  compradorID =comprador._id.toString();

  const producto = await productoSchema.insertOne({...dataset.productos[0],vendedor: vendedorID})

  const pedido = await request(app)
    .post("/pedidos")
    .send({...dataset.pedidos[0],compradorId : compradorID, items:[{productoId:producto._id.toString(),cantidad:2}]})

  pedidoID = pedido.body._id
})

afterEach(async () => {
  await clearDb();
})


afterAll(async () => {
  await closeDb();
})

function limpiarJson(json){
  return json.map(j =>{
    const{_id,__v, ...resto} = j
    return resto
  }
  )
}
/*
test("Traer notificaciones NO leidas", async () => {
   const notificacionBuscada = {...dataset.notificaciones[0],usuarioDestino : vendedorID};

    await notificacionSchema.insertMany([
      {...dataset.notificaciones[0],usuarioDestino : vendedorID},
      {...dataset.notificaciones[1],usuarioDestino : vendedorID}
    ])

    const respuesta = await request(app)
      .get(`/usuarios/${vendedorID}/notificaciones/false`)

    const notificaciones = limpiarJson(respuesta.body)
    
    expect(respuesta.status).toEqual(200)
    expect(notificaciones[1].mensaje).toEqual(notificacionBuscada.mensaje)
    expect(notificaciones[1].usuarioDestino).toEqual(notificacionBuscada.usuarioDestino.toString())
    expect(notificaciones[1].fueLeida).toEqual(false)
    expect(notificaciones[1].fechaAlta).toEqual(notificacionBuscada.fechaAlta)
})

test("Traer notificaciones SI leidas", async () => {
   const notificacionBuscada = {...dataset.notificaciones[1],usuarioDestino : vendedorID}

    await notificacionSchema.insertMany([
      {...dataset.notificaciones[0],usuarioDestino : vendedorID},
      {...dataset.notificaciones[1],usuarioDestino : vendedorID}
    ])

    const respuesta = await 
        request(app)
        .get(`/usuarios/${vendedorID}/notificaciones/true`)
    
    const notificaciones = limpiarJson(respuesta.body)

    expect(respuesta.status).toEqual(200)
    expect(notificaciones[0].mensaje).toEqual(notificacionBuscada.mensaje)
    expect(notificaciones[0].usuarioDestino).toEqual(notificacionBuscada.usuarioDestino.toString())
    expect(notificaciones[0].fueLeida).toEqual(true)
    expect(notificaciones[0].fechaAlta).toEqual(notificacionBuscada.fechaAlta)
    
})
    

test("Leer una notificacion la modifica", async() => {
  const notificacionBuscada = {...dataset.notificaciones[0],usuarioDestino : vendedorID}

  expect(notificacionBuscada.fueLeida).toBe(false)

  const notificacionesPersistidas = await notificacionSchema.create(
      {...dataset.notificaciones[0],usuarioDestino : vendedorID}
    )

  const id = notificacionesPersistidas._id.toString()
  const respuesta = await request(app).patch(`/notificaciones/${id}`)
  expect(respuesta.status).toBe(204)

  const notificacion = await notificacionSchema.findById(id)
  expect(notificacion.fueLeida).toBe(true)
})
*/

test("Cancelar Pedido crea Notificacion de Cancelacion", async () => {

  await request(app).delete(`/pedidos/${pedidoID.toString()}`)
  
  const pedido = await pedidoSchema.findById(pedidoID)
  const notificaciones = await notificacionSchema.find()
  const notificacion = await notificacionSchema.findOne({mensaje : `El pedido de valen fue cancelado.`})
  
  expect(notificaciones.length).toEqual(2)
  expect(pedido.estado).toBe("CANCELADO")
  expect(notificacion.mensaje.toString()).toEqual(`El pedido de valen fue cancelado.`)
  expect(notificacion.usuarioDestino.toString()).toEqual(vendedorID)
  

})

test("Enviar un Pedido crea Notificacion de Enviado", async () => {

 
  await request(app).post(`/pedidos/${pedidoID.toString()}/envios`)
  
  const pedido = await pedidoSchema.findById(pedidoID)
  const notificaciones = await notificacionSchema.find()
  const notificacion = await notificacionSchema.findOne({mensaje : `El pedido #${pedidoID} fue enviado por DELFINA.`})
  
  expect(notificaciones.length).toEqual(2)
  expect(pedido.estado).toBe("ENVIADO")
  expect(notificacion.mensaje.toString()).toEqual(`El pedido #${pedidoID} fue enviado por DELFINA.`)
  expect(notificacion.usuarioDestino.toString()).toEqual(compradorID)
})

test("Al crear un Pedido se Crea una notificacion al vendedor", async () => {

  const pedido = await pedidoSchema.findById(pedidoID)
  const notificaciones = await notificacionSchema.find()

  expect(notificaciones.length).toEqual(1)
  expect(pedido.estado).toBe("PENDIENTE")
  expect(notificaciones[0].usuarioDestino.toString()).toEqual(vendedorID)
  expect(notificaciones[0].mensaje.toString()).toContain(`Nuevo pedido de valen.\n`)

})
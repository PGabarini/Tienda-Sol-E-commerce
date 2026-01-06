import Usuario from "../src/models/repositories/mongoSchemas/usuarioSchema.js";
import Producto from "../src/models/repositories/producto/productoSchema.js";
import Pedido from "../src/models/repositories/mongoSchemas/pedidoSchema.js"
import Notificacion from "../src/models/repositories/mongoSchemas/notificacionSchema.js"

export const datosSemilla = async () => {
  try {
    console.log("Borrando y recargando datos semilla...");

    await Notificacion.deleteMany({});
    console.log("Notificaciones borradas");

    await Pedido.deleteMany({});
    console.log("Pedidos borrados");


    await Producto.deleteMany({});
    console.log("Productos borrados");


    await Usuario.deleteMany({ email: "delfina@gmail" });
    console.log("Vendedor borrado");

    // 3. Crear el vendedor
    const vendedor = await new Usuario({
      "nombre": "DELFINA",
      "telefono": 21321,
      "email": "delfina@gmail",
      "tipo": "VENDEDOR",
      "fechaDeAlta": new Date()
    }).save();

    // 4. Crear el producto
// Producto 1
await new Producto({
  "titulo": "Remera Básica Algodón Negro",
  "descripcion": "Remera 100% algodón de corte clásico, ideal para uso diario",
  "categorias": ["ropa", "remeras", "basico"],
  "precio": 4500,
  "moneda": "PESO_ARG",
  "stock": 25,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-negra.webp"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 2
await new Producto({
  "titulo": "Remera Premium Blanca",
  "descripcion": "Remera premium de algodón peinado, calidad superior",
  "categorias": ["ropa", "remeras", "premium"],
  "precio": 6800,
  "moneda": "PESO_ARG",
  "stock": 15,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-blanca.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 3
await new Producto({
  "titulo": "Remera Oversize Gris",
  "descripcion": "Remera oversize de corte moderno, tejido suave y cómodo",
  "categorias": ["ropa", "remeras", "oversize", "moda", "urbano"],
  "precio": 5200,
  "moneda": "PESO_ARG",
  "stock": 18,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-gris.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 4
await new Producto({
  "titulo": "Remera Manga Corta Azul",
  "descripcion": "Remera clásica color azul marino, perfecta para cualquier ocasión",
  "categorias": ["ropa", "remeras", "casual", "urbano"],
  "precio": 3900,
  "moneda": "PESO_ARG",
  "stock": 30,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-azul.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 5
await new Producto({
  "titulo": "Remera Estampada Urbana",
  "descripcion": "Remera con estampado moderno, diseño urbano y juvenil",
  "categorias": ["ropa", "remeras", "estampada", "urbano"],
  "precio": 5500,
  "moneda": "PESO_ARG",
  "stock": 12,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-estampada.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 6
await new Producto({
  "titulo": "Remera Slim Fit Roja",
  "descripcion": "Remera slim fit color rojo, corte ajustado y elegante",
  "categorias": ["ropa", "remeras", "slim-fit", "elegante"],
  "precio": 4800,
  "moneda": "PESO_ARG",
  "stock": 20,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-roja.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 7
await new Producto({
  "titulo": "Remera Eco-Friendly Verde",
  "descripcion": "Remera fabricada con algodón orgánico, comprometida con el medio ambiente",
  "categorias": ["ropa", "remeras", "basico"],
  "precio": 7200,
  "moneda": "PESO_ARG",
  "stock": 10,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-verde.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 8
await new Producto({
  "titulo": "Remera Vintage Beige",
  "descripcion": "Remera estilo vintage, color beige con efecto desgastado",
  "categorias": ["ropa", "remeras"],
  "precio": 6100,
  "moneda": "PESO_ARG",
  "stock": 14,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-beige.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 9
await new Producto({
  "titulo": "Remera de Boca",
  "descripcion": "Boca juniors remera",
  "categorias": ["ropa", "remeras", "vintage", "retro"],
  "precio": 6100,
  "moneda": "PESO_ARG",
  "stock": 14,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-boca.jpg","/uploads/remera-boca2.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Producto 10
await new Producto({
  "titulo": "Remera fea",
  "descripcion": "Remera con efecto desgastado",
  "categorias": ["ropa", "remeras", "basico", "retro"],
  "precio": 6100,
  "moneda": "PESO_ARG",
  "stock": 14,
  "cantidadVendida": 0,
  "fotos": ["/uploads/remera-gastada.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

//GORRAS
// Gorra 1
await new Producto({
  "titulo": "Gorra Clásica Negra",
  "descripcion": "Gorra clásica de baseball, color negro, ajustable con cierre trasero",
  "categorias": ["accesorios", "gorras", "deportiva", "clasica"],
  "precio": 6800,
  "moneda": "PESO_ARG",
  "stock": 20,
  "cantidadVendida": 0,
  "fotos": ["/uploads/gorra-negra.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Gorra 2
await new Producto({
  "titulo": "Gorra Trucker Azul",
  "descripcion": "Gorra estilo trucker, panel frontal de tela y trasero de malla, ideal para verano",
  "categorias": ["gorras", "trucker", "deportiva","urbana"],
  "precio": 7500,
  "moneda": "PESO_ARG",
  "stock": 15,
  "cantidadVendida": 0,
  "fotos": ["/uploads/gorra-azul.jpg","/uploads/gorra-azul2.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Gorra 3
await new Producto({
  "titulo": "Gorra Snapback Roja",
  "descripcion": "Gorra snapback ajustable, color rojo vibrante, perfecta para looks urbanos",
  "categorias": ["accesorios", "gorras", "snapback", "urbana"],
  "precio": 8200,
  "moneda": "PESO_ARG",
  "stock": 12,
  "cantidadVendida": 0,
  "fotos": ["/uploads/gorra-roja.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

//ZAPATILLAS
// Zapatilla 1
await new Producto({
  "titulo": "Zapatillas Running Ultra",
  "descripcion": "Zapatillas deportivas para running, tecnología de amortiguación avanzada, ideales para entrenamiento",
  "categorias": ["calzado", "zapatillas", "deportivas"],
  "precio": 28900,
  "moneda": "PESO_ARG",
  "stock": 8,
  "cantidadVendida": 0,
  "fotos": ["/uploads/zapatilla-running.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Zapatilla 2
await new Producto({
  "titulo": "Zapatillas Urbanas Classic White",
  "descripcion": "Zapatillas urbanas clásicas color blanco, versátiles para uso diario y casual",
  "categorias": ["calzado", "zapatillas", "urbanas", "clasicas"],
  "precio": 24500,
  "moneda": "PESO_ARG",
  "stock": 12,
  "cantidadVendida": 0,
  "fotos": ["/uploads/zapatilla-blanca.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Zapatilla 3
await new Producto({
  "titulo": "Zapatillas Basketball Pro",
  "descripcion": "Zapatillas profesionales para basketball, sujeción ankle-top y máxima tracción en cancha",
  "categorias": ["calzado", "zapatillas", "deportivas", "basketball"],
  "precio": 32500,
  "moneda": "PESO_ARG",
  "stock": 6,
  "cantidadVendida": 0,
  "fotos": ["/uploads/zapatilla-basquet.jpg","/uploads/zapatilla-basquet2.jpg"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

// Zapatilla 4
await new Producto({
  "titulo": "Zapatillas Skateboard Street",
  "descripcion": "Zapatillas diseñadas para skateboarding, suela resistente y capellada reforzada",
  "categorias": ["calzado", "zapatillas", "skate", "urbanas", "streetwear"],
  "precio": 26800,
  "moneda": "PESO_ARG",
  "stock": 10,
  "cantidadVendida": 0,
  "fotos": ["/uploads/vans2.webp"],
  "activo": true,
  "vendedor": vendedor._id
}).save();

    console.log("Datos semilla recargados completamente");

  } catch (error) {
    console.error("Error recargando datos semilla", error);
  }
};
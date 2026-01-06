import "dotenv/config";
import application from "./src/app/application.js";
import { conectarDB } from "./src/app/db.js";
import "./src/models/repositories/mongoSchemas/usuarioSchema.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import uploadsRouter from "./src/app/uploads.js"; 
import { datosSemilla } from "./mongo-init/init-db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = await application();
await conectarDB();
await datosSemilla();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", uploadsRouter);
app.use("/fotosProductos", express.static(path.join(process.cwd(), "fotosProductos")));


app.listen(process.env.SERVER_PORT, () => {
  console.log(`Orígenes permitidos: ${process.env.ALLOWED_ORIGINS}${process.env.SERVER_PORT}`);
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});

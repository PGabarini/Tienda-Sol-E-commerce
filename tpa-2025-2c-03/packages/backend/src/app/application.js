import express from "express";
import cors from "cors";
import router from "./routes.js";
import errorHandler from "./errorHandler.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const swaggerDocument = JSON.parse(fs.readFileSync("src/docs/api-docs.json", "utf-8"));

export default async function application() {
  const app = express()
  app.use(express.json());


  app.use(cors({
    origin: [
    "http://localhost:3000",
    "https://tienda-sol-jaguares.netlify.app"
  ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));


  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  app.use("/api-docs", (req, res) => res.json(swaggerDocument)); // yaml
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // interfaz
  app.use("/", router);
  app.use(errorHandler);
  app.use("/fotosProductos", express.static(path.join(process.cwd(), "fotosProductos")));

  return app;
}
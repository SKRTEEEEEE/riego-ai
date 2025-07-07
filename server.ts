// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { conectarMongo, guardarLecturas } from "./src/app/db";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Lanzar tarea cada 2 horas
setInterval(guardarLecturas, 2 * 60 * 60 * 1000);

// También al inicio del servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor Express en http://localhost:${PORT}`);
  await conectarMongo();
  await guardarLecturas();
});

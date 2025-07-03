// src/server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { generarDatoMC } from "./app/mc-fake";
import { DatoSensor } from "./models/datos-sensor";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "";

async function conectarMongo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
  }
}

async function guardarLecturas() {
  const cultivos = ["lechugas", "tomates"] as const;

  for (const cultivo of cultivos) {
    const dato = generarDatoMC(cultivo);
    await DatoSensor.create(dato);
    console.log(`📥 Insertado dato para ${cultivo}:`, dato);
  }
}

// Lanzar tarea cada 2 horas
setInterval(guardarLecturas, 2 * 60 * 60 * 1000);

// También al inicio del servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor Express en http://localhost:${PORT}`);
  await conectarMongo();
  await guardarLecturas();
});

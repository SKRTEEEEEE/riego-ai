// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { conectarMongo, guardarLecturas } from "./src/app/db";
import { connectModbusRTU } from "./src/app/modbus";
import { calcularMediasHistoricas } from "./src/app/media-fake";
import { obtenerDatosClimaticos } from "./src/app/weather";
import { obtenerRecomendacionRiego } from "./src/app/ai-pred";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4321;

// Intervalo para lanzar lectura campo (microprocesadores) cada 2 horas
setInterval(guardarLecturas, 2 * 60 * 60 * 1000);

// Endpoint para verificar la conexión a la PLC + estado de la PLC
app.get("/plc/status", async (req, res) => {
  try {
    const client = await connectModbusRTU("10.20.30.152");
    if(client.isOpen)res.status(200).json({ status: true,message:"PLC is online" })
    else res.status(500).json({ status: false, message: "PLC is offline" });
  } catch (error) {
    console.error("Error checking PLC status:", error);
    res.status(500).json({ error: "Error checking PLC status" });
  }
});

// Endpoint para mostrar los datos de la predicción de riego de la IA
app.post("/prediction", async (req, res) => {
  try {
    const data = req.body;
    const [datosHistoricos, datosClimaticos] = await Promise.all([
      calcularMediasHistoricas(data.cultivo || "tomates"),
      obtenerDatosClimaticos()
    ]);
    const predictionData = await obtenerRecomendacionRiego(datosHistoricos, datosClimaticos, {
      rangoPhIdeal: data.rangoPhIdeal || [5.5, 6],
      phAguaPrevio: data.phAguaPrevio || 7.1,
      cultivo: data.cultivo || "tomates",
    });
     

    res.status(200).json(predictionData);
    }
   catch (error) {
    console.error("Error with prediction data:", error);
    res.status(500).json({ error: "Error with prediction data" });
  } 
});

// ⬇️🏗️

// Endpoint para aplicar la predicción de riego de la IA (guardar en la bdd)

// Intervalo para ejecutar la mezcla de nutrientes (al aplicar la predicción o 1 hora antes de la hora de riego si no se aplica predicción para dicho dia)

// Intervalo para ejecutar el riego (en la hora de riego indicada por la IA o usuario)

// Endpoint para modificar por prompt los datos de la predicción de riego de la IA


app.listen(PORT, async () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  await conectarMongo();
  // Lanzar lectura campo (microprocesadores) 
  await guardarLecturas();
});

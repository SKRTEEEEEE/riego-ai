// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { conectarMongo, guardarCultivo, guardarLecturas } from "./src/app/db";
import { connectModbusRTU } from "./src/app/modbus";
import { calcularMediasHistoricas } from "./src/app/media-fake";
import { obtenerDatosClimaticos } from "./src/app/weather";
import { obtenerRecomendacionRiego } from "./src/app/ai-pred";
import { mockResponse } from "./src/app/ai-const";
import { clickBotonVerde } from "./src/app/write-plc";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4321;

app.use(express.json()); // Middleware para parsear JSON

// Intervalo para lanzar lectura campo (microprocesadores) cada 2 horas
setInterval(guardarLecturas, 2 * 60 * 60 * 1000);

// Endpoint para verificar la conexión a la PLC + estado de la PLC
app.get("/plc/status", async (_, res) => {
  try {
    const client = await connectModbusRTU("10.20.30.152");
    if(client.isOpen)res.status(200).json({ status: true,message:"PLC is online" })
    else res.status(500).json({ status: false, message: "PLC is offline" });
  } catch (error) {
    console.error("Error checking PLC status:", error);
    res.status(500).json({ status: false, message: "PLC is offline", error: "Error checking PLC status" });
  }
});

// Endpoint para mostrar los datos de la predicción de riego de la IA
app.post("/prediction", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data for prediction:", data);
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

app.post("/prediction/test", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received test data for prediction:", data);
    if (data) {
      res.status(200).json(mockResponse); //mock response ya es de tipo json
      return;
    }
  } catch (error) {
    console.error("Error with test prediction data:", error);
    res.status(500).json({ error: "Error with test prediction data" });
  }  
} 
  )   

// Endpoint para aplicar la predicción de riego de la IA (guardar en la bdd)
app.post("/riego/:cultivo", async (req, res)=> {
  try {
    const cultivo = req.params.cultivo; // obtener el cultivo del path
    const body = req.body; // obtener el body con los datos
    console.log("Received riego data for cultivo:", cultivo, "with body:", body);
    // Si body es un array, mapear, si no, envolver en array
    const datos = Array.isArray(body) ? body : [body];
    const pars = datos.map((bo) => ({ ...bo, cultivo }));
    const result = await guardarCultivo(pars);
    // Si se ha guardado, efectuar la mezcla el próximo día, y guardar que ya está hecha la mezcla (lógica pendiente)
    if (result && result.length > 0) {
      console.log("Riego cultivo data saved successfully:", result);
      const btn = await clickBotonVerde(true);
      if (btn) {
        console.log("✅ Botón verde activado para mezcla de nutrientes");
        res.status(200).json(result);
      } else {
        console.error("❌ Error al activar el botón verde para mezcla de nutrientes");
        res.status(400).json(result);
      }
    }
    
  } catch (error) {
    console.error("Error at save riego cultivo data:", error);
    res.status(500).json({ error: "Error at save riego cultivo data" });
  }
})


// ⬇️🏗️
// Intervalo para ejecutar la mezcla de nutrientes (al aplicar la predicción o 1 hora antes de la hora de riego si no se aplica predicción para dicho dia)
setInterval(()=>{
  //Si no se ha ejecutado app.post(/riego/:cultivo) dentro de el intervalo, ejecutar la mezcla de nutrientes
}, 24 * 60 * 60 * 1000);

// Intervalo para ejecutar el riego (en la hora de riego indicada por la IA o usuario)

// Endpoint para modificar por prompt los datos de la predicción de riego de la IA


app.listen(PORT, async () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  await conectarMongo();
  // Lanzar lectura campo (microprocesadores) 
  await guardarLecturas();
});

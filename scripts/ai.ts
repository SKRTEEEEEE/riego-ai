import { obtenerDatosUltimoMes } from "../app/db";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { calcularMediasHistoricas } from "../app/server-fake";
import { obtenerRecomendacionRiego } from "../app/ai-pred";
import { obtenerDatosClimaticos } from "../app/weather";
dotenv.config()
mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log("✅ Conexión exitosa a MongoDB");
}).catch((error) => {
  console.error("❌ Error al conectar a MongoDB:", error);
});

async function main() {
    console.log("🚀 Starting AI script...");
    
    try {
        mongoose.connect(process.env.MONGODB_URI!).then(() => {
            console.log("✅ Conexión exitosa a MongoDB");
          }).catch((error) => {
            console.error("❌ Error al conectar a MongoDB:", error);
          });
        
        const datosHistoricos = await calcularMediasHistoricas("tomates");
        console.log("📈 Medias históricas calculadas:", datosHistoricos);
        const datosClimaticos = await obtenerDatosClimaticos();
        console.log("🌤️ Datos climáticos obtenidos:", datosClimaticos);
        const iaRes = await obtenerRecomendacionRiego("tomates",datosHistoricos,datosClimaticos )
        console.log("🤖 Recomendación de riego obtenida:", iaRes);
        console.log("✅ Script completed successfully");
        process.exit(1);
    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    }
}

// Ejecutar la función main
main().catch((error) => {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
});
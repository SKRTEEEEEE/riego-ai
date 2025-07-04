import { obtenerDatosUltimoMes } from "../app/db";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { calcularMediasHistoricas } from "../app/server-fake";
dotenv.config()
console.log("🌍 Conectando a MongoDB...")
console.log("MONGODB_URI:", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log("✅ Conexión exitosa a MongoDB");
}).catch((error) => {
  console.error("❌ Error al conectar a MongoDB:", error);
});

async function main() {
    console.log("🚀 Starting Db Read script...");
    
    try {
        mongoose.connect(process.env.MONGODB_URI!).then(() => {
            console.log("✅ Conexión exitosa a MongoDB");
          }).catch((error) => {
            console.error("❌ Error al conectar a MongoDB:", error);
          });
        const datos = await obtenerDatosUltimoMes("tomates")
        console.log("📊 Datos del último mes para tomates:", datos);
        const datosHistoricos = await calcularMediasHistoricas("tomates");
        console.log("📈 Medias históricas calculadas:", datosHistoricos);
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
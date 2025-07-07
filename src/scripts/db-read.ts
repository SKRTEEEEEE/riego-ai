import { obtenerDatosUltimoMes } from "../app/db";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { calcularMediasHistoricas } from "../app/media-fake";
dotenv.config()


async function main() {
    console.log("🚀 Starting Db Read script...");
    console.log("🌍 Conectando a MongoDB...");
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
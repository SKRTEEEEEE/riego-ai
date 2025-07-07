import mongoose from "mongoose";
import { DatoSensor } from "../models/datos-sensor";
import { Cultivo, generarDatoMC } from "./mc-fake";
import dotenv from "dotenv";

const MONGODB_URI = process.env.MONGODB_URI || "";
dotenv.config();

/**
 * Conecta a la base de datos MongoDB utilizando Mongoose.
 * Asegúrate de que la variable de entorno MONGODB_URI esté configurada correctamente.
 * @returns {Promise<void>} - Promesa que se resuelve cuando la conexión es exitosa.
 * @throws {Error} - Si ocurre un error al conectar a la base de datos.
 */

export async function conectarMongo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    throw new Error("No se pudo conectar a la base de datos MongoDB.");
  }
}

/**
 * Obtiene los datos del último mes para un cultivo específico.
 * @param {string} cultivo - El nombre del cultivo (por ejemplo, "tomates" o "lechugas").
 * @returns {Promise<any[]>} - Lista de datos del último mes para el cultivo especificado.
 */
export const obtenerDatosUltimoMes = async (cultivo: Cultivo): Promise<any[]> => {
  try {
    const fechaActual = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);

    const datos = await DatoSensor.find({
      cultivo: cultivo,
      timestamp: {
        $gte: fechaInicio.toISOString(),
        $lte: fechaActual.toISOString(),
      }
    }).select("-_id -__v -cultivo").exec();

    return datos;
  } catch (error) {
    console.error("Error al obtener los datos del último mes:", error);
    throw new Error("No se pudieron obtener los datos del último mes.");
  }
};

/**
 * Guarda lecturas de datos simulados para cultivos específicos.
 * Esta función genera datos de cultivo y los guarda en la base de datos.
 * @returns {Promise<void>} - Promesa que se resuelve cuando las lecturas se guardan correctamente.
 * @throws {Error} - Si ocurre un error al guardar los datos.
 */

export async function guardarLecturas() {
  const cultivos = ["lechugas", "tomates"] as const;

  for (const cultivo of cultivos) {
    const dato = generarDatoMC(cultivo);
    await DatoSensor.create(dato);
    console.log(`📥 Insertado dato para ${cultivo}:`, dato);
  }
}
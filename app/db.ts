import { DatoSensor } from "../models/datos-sensor";
import { Cultivo } from "./mc-fake";

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
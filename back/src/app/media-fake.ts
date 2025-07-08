import { obtenerDatosUltimoMes } from "./db";
import { Cultivo } from "./mc-fake";

/**
 * Tipo para representar las medias historicas de un cultivo en concreto.
 */
export type MediaHistorica = {
    mediaDiaria: MediaDiaria[];
    mediaSemanal: MediaSemanal[];
  };

/**
 * Tipo para representar las medias diarias.
 */
type MediaDiaria = {
  dia: string;
  humedadMedia: number;
  temperaturaMedia: number;
};

/**
 * Tipo para representar las medias semanales.
 */
type MediaSemanal = {
  semana: string;
  humedadMedia: number;
  temperaturaMedia: number;
};

/**
 * Calcula las medias diarias y semanales de humedad y temperatura del suelo.
 * Si faltan días, genera valores basados en los días disponibles con una variación del 1%.
 * @param {Cultivo} cultivo - Nombre del cultivo (por ejemplo, "tomates").
 * @returns {Promise<MediaHistorica>} - Medias diarias y semanales.
 */
export const calcularMediasHistoricas = async (
  cultivo: Cultivo
): Promise<{ mediaDiaria: MediaDiaria[]; mediaSemanal: MediaSemanal[] }> => {
  try {
    const datos = await obtenerDatosUltimoMes(cultivo);

    // Agrupar por día
    const datosPorDia = datos.reduce((acc: Record<string, typeof datos[0][]>, dato) => {
      const dia = new Date(dato.timestamp).toISOString().split("T")[0]; // Obtener solo la fecha
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(dato);
      return acc;
    }, {});

    // Calcular medias diarias
    const mediaDiaria = Object.keys(datosPorDia).map(dia => {
      const datosDelDia = datosPorDia[dia];
      const humedadMedia = datosDelDia.reduce((sum, d) => sum + d.humedadSuelo, 0) / datosDelDia.length;
      const temperaturaMedia = datosDelDia.reduce((sum, d) => sum + d.temperaturaSuelo, 0) / datosDelDia.length;
      return { dia, humedadMedia, temperaturaMedia };
    });

    // Generar datos para días faltantes
    const fechaActual = new Date();
    const diasUltimos7 = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() - i);
      return fecha.toISOString().split("T")[0];
    });

    const mediaDiariaCompleta = diasUltimos7.map(dia => {
      const datoExistente = mediaDiaria.find(d => d.dia === dia);
      if (datoExistente) return datoExistente;

      // Generar valores basados en días disponibles con una variación del 1%
      const referencia = mediaDiaria[Math.floor(Math.random() * mediaDiaria.length)];
      return {
        dia,
        humedadMedia: referencia.humedadMedia * (1 + (Math.random() - 0.5) * 0.02), // Variación del 1%
        temperaturaMedia: referencia.temperaturaMedia * (1 + (Math.random() - 0.5) * 0.02), // Variación del 1%
      };
    });

    // Agrupar por semana
    const datosPorSemana = Array.from({ length: 4 }, (_, i) => {
      const fechaInicioSemana = new Date(fechaActual);
      fechaInicioSemana.setDate(fechaInicioSemana.getDate() - (i + 1) * 7);
      const fechaFinSemana = new Date(fechaInicioSemana);
      fechaFinSemana.setDate(fechaInicioSemana.getDate() + 6);

      const datosDeLaSemana = mediaDiariaCompleta.filter(dato => {
        const fechaDato = new Date(dato.dia);
        return fechaDato >= fechaInicioSemana && fechaDato <= fechaFinSemana;
      });

      const humedadMedia = datosDeLaSemana.reduce((sum, d) => sum + d.humedadMedia, 0) / datosDeLaSemana.length || 0;
      const temperaturaMedia = datosDeLaSemana.reduce((sum, d) => sum + d.temperaturaMedia, 0) / datosDeLaSemana.length || 0;

      return {
        semana: `${fechaInicioSemana.toISOString().split("T")[0]} - ${fechaFinSemana.toISOString().split("T")[0]}`,
        humedadMedia,
        temperaturaMedia,
      };
    });

    return { mediaDiaria: mediaDiariaCompleta, mediaSemanal: datosPorSemana };
  } catch (error) {
    console.error("Error al calcular las medias históricas:", error);
    throw new Error("No se pudieron calcular las medias históricas.");
  }
};
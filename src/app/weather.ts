import axios from "axios";

/**
 * Consulta la API de Open-Meteo para obtener datos climáticos.
 * @param {number|undefined} latitude - Latitud del lugar.
 * @param {number|undefined} longitude - Longitud del lugar.
 * @returns {Promise<any>} - Respuesta de la API con los datos climáticos.
 */
export const obtenerDatosClimaticos = async (latitude = 41.3888, longitude = 2.159): Promise<any> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,sunshine_duration,snowfall,showers`;
    const response = await axios.get(url);
    return parseDatosClimaticos(response.data);
  } catch (error) {
    console.error("Error al obtener los datos climáticos:", error);
    throw new Error("No se pudieron obtener los datos climáticos.");
  }
};

/**
 * Procesa los datos climáticos obtenidos de la API de open-meteo.
 * @param {any} data - Datos climáticos en formato JSON.
 * @returns {Array} - Array de objetos con los datos meteorológicos por hora.
 */

export const parseDatosClimaticos = (data: any) => {
const { time, temperature_2m, relative_humidity_2m, precipitation_probability, precipitation, sunshine_duration } = data.hourly;

const datosMeteoPorHora = time.map((t: any, i: number) => ({
  // fecha: t.split("T")[1], // "06:00"
  fecha: t,
  temperatura: temperature_2m[i],
  humedad: relative_humidity_2m[i],
  probLluvia: precipitation_probability[i],
  lluvia: precipitation[i],
  sol: sunshine_duration[i]
}));
return datosMeteoPorHora;
}
import { MediaHistorica } from './server-fake';
import { Cultivo } from './mc-fake';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

 const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://airiego.openai.azure.com/";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
const apiVersion = "2025-01-01-preview";
const deployment = "gpt-4.1-nano";

const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export const obtenerRecomendacionRiego = async (cultivo: Cultivo, datosHistoricos: MediaHistorica, clima: string) => {
  console.log("🚀 Iniciando la obtención de recomendación de riego...");
  console.log("endpoint:", endpoint);
  console.log("apiKey:", apiKey);
  const prompt = `
  Dados los siguientes datos históricos: 
  
  ${JSON.stringify(datosHistoricos)}.

  Y las siguientes condiciones climáticas, descritas de la siguiente manera:
  - **latitude**: Latitud del lugar en grados decimales.
  - **longitude**: Longitud del lugar en grados decimales.
  - **timezone**: Zona horaria del lugar (por ejemplo, GMT).
  - **elevation**: Elevación del lugar en metros sobre el nivel del mar.
  - **hourly_units**: Unidades de medida para los datos climáticos horarios:
    - **temperature_2m**: Temperatura a 2 metros del suelo (°C).
    - **relative_humidity_2m**: Humedad relativa a 2 metros del suelo (%).
    - **precipitation_probability**: Probabilidad de precipitación (%).
    - **precipitation**: Cantidad de precipitación acumulada (mm).
    - **rain**: Cantidad de lluvia acumulada (mm).
    - **sunshine_duration**: Duración de la luz solar (segundos).
    - **snowfall**: Cantidad de nieve acumulada (cm).
    - **showers**: Cantidad de chubascos acumulados (mm).
  - **hourly**: Datos climáticos horarios:
    - **time**: Lista de tiempos en formato ISO8601.
    - **temperature_2m**: Lista de temperaturas a 2 metros del suelo (°C) para cada hora.
    - **relative_humidity_2m**: Lista de valores de humedad relativa a 2 metros del suelo (%) para cada hora.
    - **precipitation_probability**: Lista de probabilidades de precipitación (%) para cada hora.
    - **precipitation**: Lista de cantidades de precipitación acumulada (mm) para cada hora.
    - **rain**: Lista de cantidades de lluvia acumulada (mm) para cada hora.
    - **sunshine_duration**: Lista de duraciones de luz solar (segundos) para cada hora.
    - **snowfall**: Lista de cantidades de nieve acumulada (cm) para cada hora.
    - **showers**: Lista de cantidades de chubascos acumulados (mm) para cada hora.

  ${clima}

  ¿Cuál debería ser la cantidad de riego recomendada para un cultivo profesional de ${cultivo}, durante la próxima semana?
  La respuesta debe tener el siguiente formato JSON (y solo dicha respuesta):
  { "[dia actual + 1]":
    {
      "tiempoSalidaMezclaReguladorPH": "[numero en ms de tiempo de abertura]",
      "tiempoSalidaMezclaNitrogeno":  "[numero en ms de tiempo de abertura]",
      "tiempoSalidaMezclaFosforo":  "[numero en ms de tiempo de abertura]",
      "tiempoSalidaMezclaPotasio": "[numero en ms de tiempo de abertura]",
      "caudalSalidaRiego": "[numero en de cantidad de presión en el paso de salida de agua]",
      "tiempoRiego": {
        "horaInicio": "[Hora de inicio del riego (0-23)]",
        "horaFin": "[Hora de fin del riego (0-23)]",
        "dia": "[Día de la semana (0-6, donde 0 es domingo)]"
      },
      "cantidadReguladorPH": "[cantidad de regulador de pH en L/ha]",
      "cantidadRiego": "[cantidad de agua en mm/día]",
      "cantidadNutrientes": {
        "nitrógeno": "[cantidad de nitrógeno en kg/ha]",
        "fósforo": "[cantidad de fósforo en kg/ha]",
        "potasio": "[cantidad de potasio en kg/ha]"
    },
    "[dia actual + 2]":
    {
      "tiempoSalidaMezclaReguladorPH": "[numero en ms de tiempo de abertura]",
      "tiempoSalidaMezclaNitrogeno":  "[numero en ms de tiempo de abertura]",
      "tiempoSalidaMezclaFosforo":  "[numero en ms de tiempo de abertura]",
      "tiempoSalidaMezclaPotasio": "[numero en ms de tiempo de abertura]",
      "caudalSalidaRiego": "[numero en de cantidad de presión en el paso de salida de agua]",
      "tiempoRiego": {
        "horaInicio": "[Hora de inicio del riego (0-23)]",
        "horaFin": "[Hora de fin del riego (0-23)]",
        "dia": "[Día de la semana (0-6, donde 0 es domingo)]"
      },
      "cantidadReguladorPH": "[cantidad de regulador de pH en L/ha]",
      "cantidadRiego": "[cantidad de agua en mm/día]",
      "cantidadNutrientes": {
        "nitrógeno": "[cantidad de nitrógeno en kg/ha]",
        "fósforo": "[cantidad de fósforo en kg/ha]",
        "potasio": "[cantidad de potasio en kg/ha]"
    },
    "[dia actual + 3]":
    {
      [seguir el mismo formato para los siguientes días hasta el día actual + 7]
    },
  `;

  try {
    const result = await client.chat.completions.create({
      model: deployment,
      messages: [{ role: "user", content: prompt }],
      // messages: [
      //   { role: "system", content: SYSTEM_CONTEXT },
      //   { role: "user", content: prompt }
      // ],
      max_tokens: 1200,
      temperature: 0.3,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error al comunicarse con la API de Azure OpenAI', error);
    throw new Error('No se pudo obtener la recomendación de riego');
  }
};

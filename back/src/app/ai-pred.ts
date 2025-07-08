import { MediaHistorica } from './media-fake';
import { Cultivo } from './mc-fake';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_CONTEXT } from './ai-const';

dotenv.config();

 const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://airiego.openai.azure.com/";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
// const apiVersion = "2025-01-01-preview";
// const deployment = "gpt-4.1-nano";
// const apiVersion = "2025-01-01-preview";
//   const deployment = "o3-mini";
  const apiVersion = "2025-01-01-preview";
  const deployment = "gpt-4.1";

const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export const obtenerRecomendacionRiego = async (cultivo: Cultivo, datosHistoricos: MediaHistorica, clima: string) => {
  console.log("🚀 Iniciando la obtención de recomendación de riego...");
  const prompt = `Para un cultivo de ${cultivo}. A partir de los siguientes datos:

- Datos históricos diarios y semanales (mediaDiaria, mediaSemanal)
- Datos meteorológicos por hora (datosMeteoPorHora) desde Open-Meteo
- Parámetro de calidad del agua (phAguaPrevio)

Calcula una recomendación diaria de fertirrigación para los próximos 7 días (utiliza las fechas de los datos meteorológicos para calcular las recomendaciones. Teniendo en cuenta que la fecha de hoy es ${new Date().toISOString().split('T')[0]}), optimizando los siguientes aspectos:

- Selecciona horas con menor evaporación y baja radiación solar, evitando lluvia
- Ajusta el riego si se prevé lluvia o la humedad histórica es alta
- Corrige el pH si está fuera del rango ideal (5.5 – 6.5)
- Calcula el tiempo de mezcla de nutrientes en milisegundos
- Usa el volumen total del depósito (500L) para calcular dosis totales a inyectar
- Usa los valores típicos indicados en el sistema si no se dan dosis exactas


### Ph Agua Previo
- El pH del agua de riego previo es de 7.4, lo que indica que es ligeramente alcalina.

### Datos Históricos
${datosHistoricos}

### Datos Meteorológicos
${clima}
#### Analiza los datos meteorológicos y adapta las recomendaciones día a día según estos.
  `;

  try {
    const result = await client.chat.completions.create({
      model: deployment,
      // messages: [{ role: "user", content: prompt }],
      messages: [
        { role: "system", content: SYSTEM_CONTEXT },
        { role: "user", content: prompt }
      ]
      ,
      max_tokens: 1500,
      temperature: 0.3,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
      // ,max_completion_tokens: 100000
    });

    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error al comunicarse con la API de Azure OpenAI', error);
    throw new Error('No se pudo obtener la recomendación de riego');
  }
};

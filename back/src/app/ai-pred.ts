import { MediaHistorica } from './media-fake';
import { Cultivo } from './mc-fake';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
import { getSystemContext } from './ai-const';

export type EspecificacionesSystemPrompt = {
  volumenMaxDepositoMezcla: number; // Volumen total del depósito de mezcla en litros
  caudalesNutrientes: {
    reguladorPH: number; // Caudal de inyección del regulador de pH en L/h
    nitrogeno: number; // Caudal de inyección de nitrógeno en L/h
    fosforo: number; // Caudal de inyección de fósforo en L/h
    potasio: number; // Caudal de inyección de potasio en L/h
  },
  concentracionNutrientes: {
    nitrogeno: number; // Concentración de nitrógeno en g/L
    fosforo: number; // Concentración de fósforo en g/L
    potasio: number; // Concentración de potasio en g/L
  }
}

export type EspecificacionesUserPrompt = {
  rangoPhIdeal?: [number, number]; // Rango ideal de pH para el agua de riego
  phAguaPrevio: number; // pH del agua de riego previo

  cultivo: Cultivo; // Tipo de cultivo para el que se generan las recomendaciones

}
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

export const obtenerRecomendacionRiego = async ( datosHistoricos: MediaHistorica, clima: string, esp:EspecificacionesUserPrompt,userPrompt?: string) => {
  console.log("🚀 Iniciando la obtención de recomendación de riego...");
  const prompt = `Para un cultivo de ${esp.cultivo}. A partir de los siguientes datos:

- Datos históricos diarios y semanales (mediaDiaria, mediaSemanal)
- Datos meteorológicos por hora (datosMeteoPorHora) desde Open-Meteo
- Parámetro de calidad del agua (phAguaPrevio)

Calcula una recomendación diaria de fertirrigación para los próximos 7 días (utiliza las fechas de los datos meteorológicos para calcular las recomendaciones. Teniendo en cuenta que la fecha de hoy es ${new Date().toISOString().split('T')[0]}), y los siguientes aspectos:

${userPrompt ? `- **` + userPrompt + `**` : ''}
- Selecciona horas con menor evaporación y baja radiación solar, evitando lluvia
- Ajusta el riego si se prevé lluvia o la humedad histórica es alta, modificando la cantidad de riego (mm/dia) y calculando el tiempo de riego ideal y el caudal de salida necesario.
- Calcula el tiempo de inyección de nutrientes en milisegundos necesarios para un cultivo de ${esp.cultivo}, adaptando-lo según la meteorología y las condiciones del suelo para obtener una cantidad de nutrientes ideal. Teniendo en cuenta el caudal de inyección de cada nutriente y la concentración de nutrientes en el liquido a inyectar en el tanque de mezcla.
- Corrige el pH si está fuera del rango ideal (${esp.rangoPhIdeal ? esp.rangoPhIdeal[0] + " - " + esp.rangoPhIdeal[1] : "5.5 - 7.0"})


### Ph Agua Previo
- El pH del agua de riego previo es de ${esp.phAguaPrevio}.

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
        { role: "system", content: getSystemContext({volumenMaxDepositoMezcla: 100000,caudalesNutrientes: {
          reguladorPH: 10, // L/h
          nitrogeno: 10, // L/h
          fosforo: 1, // L/h
          potasio: 1 // L/h
        },
        concentracionNutrientes: {
          nitrogeno: 0.5, // Kg/L
          fosforo: 0.5, // Kg/L
          potasio: 0.5 // Kg/L
        }
      }
      ) },
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

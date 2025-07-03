import axios from 'axios';



export const obtenerRecomendacionRiego = async (datosHistoricos: any[], climaActual: any) => {
  const prompt = `Dados los siguientes datos históricos: ${JSON.stringify(datosHistoricos)}, 
  y las condiciones actuales: 
  Temperatura: ${climaActual.main.temp}°C, 
  Humedad: ${climaActual.main.humidity}%, 
  ¿Cuál debería ser la cantidad de riego recomendada para las plantas, durante la proxima semana?
  La respuesta debe tener el siguiente formato JSON (y solo dicha respuesta):
  {
  
  }
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error al comunicarse con la API de OpenAI', error);
    throw new Error('No se pudo obtener la recomendación de riego');
  }
};

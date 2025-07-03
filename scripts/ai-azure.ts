import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
// Configuración para Azure OpenAI
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `https://${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2024-02-01' },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  },
});

// Interfaz para las respuestas
interface ChatResponse {
  content: string;
  role: 'assistant' | 'user' | 'system';
}

// Función para generar completaciones de chat
export async function generateChatCompletion(
  messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  maxTokens: number = 150,
  temperature: number = 0.7
): Promise<ChatResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4.1-nano-2025-04-14',
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const choice = response.choices[0];
    if (choice?.message) {
      return {
        content: choice.message.content || '',
        role: choice.message.role as 'assistant'
      };
    }

    throw new Error('No response received from Azure OpenAI');
  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error);
    throw error;
  }
}

// Función para generar completaciones de texto (legacy)
export async function generateTextCompletion(
  prompt: string,
  maxTokens: number = 150,
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4.1-nano-2025-04-14',
      prompt: prompt,
      max_tokens: maxTokens,
      temperature: temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0]?.text || '';
  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error);
    throw error;
  }
}

// Función para generar embeddings
export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

// Función para streaming de chat (útil para respuestas largas)
export async function streamChatCompletion(
  messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  onChunk: (chunk: string) => void,
  maxTokens: number = 150,
  temperature: number = 0.7
): Promise<void> {
  try {
    const stream = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4.1-nano-2025-04-14',
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error streaming chat completion:', error);
    throw error;
  }
}

// Ejemplo de uso
async function main() {
  try {
    // Ejemplo 1: Chat completion con GPT-4.1-nano
    const chatMessages = [
      { role: 'system' as const, content: 'Eres un asistente útil.' },
      { role: 'user' as const, content: '¿Cuál es la capital de España?' }
    ];

    const chatResponse = await generateChatCompletion(chatMessages);
    console.log('Chat Response:', chatResponse.content);

    // Ejemplo 2: Text completion con GPT-4.1-nano
    const textPrompt = 'Escribe un poema sobre la primavera:';
    const textResponse = await generateTextCompletion(textPrompt, 100);
    console.log('Text Response:', textResponse);

    // Ejemplo 3: Embeddings
    const embeddings = await generateEmbeddings('Texto para generar embeddings');
    console.log('Embeddings length:', embeddings.length);

    // Ejemplo 4: Streaming chat (útil para respuestas en tiempo real)
    console.log('\nStreaming response:');
    await streamChatCompletion(
      [{ role: 'user', content: 'Cuéntame una historia corta' }],
      (chunk) => process.stdout.write(chunk),
      200,
      0.8
    );
    console.log('\n');

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Ejecutar el ejemplo
if (require.main === module) {
  main();
}
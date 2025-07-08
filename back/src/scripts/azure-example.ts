import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function main() {
  // Tendrá que establecer estas variables de entorno o editar los siguientes valores.
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://airiego.openai.azure.com/";
  const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
  const apiVersion = "2025-01-01-preview";
  const deployment = "gpt-4.1-nano"; // Debe coincidir con el nombre de la implementación

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  const result = await client.chat.completions.create({
    model: deployment,
    messages: [
      { role: "system", content: "Es un asistente de inteligencia artificial que ayuda a los usuarios a encontrar información." }
    ],
    max_tokens: 800,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null
  });
  // No hay nada mal en la estructura del código, pero la clave es que el parámetro model debe estar presente.
  // En la documentación oficial, a veces el ejemplo omite el parámetro model si se usa una versión antigua del SDK.
  // En tu código, ya incluiste model: deployment, lo cual es correcto para el SDK moderno.
  // Si sigues viendo el error, asegúrate de que:
  // 1. Estás usando la versión más reciente del paquete openai.
  // 2. El valor de deployment corresponde exactamente al nombre de tu despliegue en Azure OpenAI.
  // 3. El endpoint y apiKey son correctos.
  // 4. El parámetro stop puede omitirse si no lo necesitas (puedes quitar stop: null).
  // 5. Si el error persiste, elimina stop: null y prueba de nuevo.
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
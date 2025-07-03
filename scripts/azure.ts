import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

dotenv.config();

export async function main() {
  // Tendrá que establecer estas variables de entorno o editar los siguientes valores.
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://airiego.openai.azure.com/";
  const apiVersion = "2025-01-01-preview";
  const deployment = "gpt-4.1-nano"; // Debe coincidir con el nombre de la implementación

  // Inicializar DefaultAzureCredential
  const credential = new DefaultAzureCredential();
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(credential, scope);

  // Inicializar el cliente de AzureOpenAI con autenticación de Entra ID (Azure AD).
  const client = new AzureOpenAI({ endpoint, azureADTokenProvider, apiVersion, deployment });

  const result = await client.chat.completions.create({
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

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
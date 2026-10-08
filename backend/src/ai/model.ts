import { ChatOllama } from '@langchain/ollama';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Gets configured ChatOllama instance based on environment variables
 */
export function getOllamaModel(temperature = 0.2, jsonFormat = true): ChatOllama {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'qwen3:4b';

  return new ChatOllama({
    baseUrl: baseUrl,
    model: modelName,
    temperature: temperature,
    format: jsonFormat ? 'json' : undefined,
  });
}

/**
 * Utility to check if the local Ollama instance and model are reachable
 */
export async function checkOllamaAvailability(): Promise<{ available: boolean; error?: string }> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'qwen3:4b';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { available: false, error: `Ollama returned HTTP status ${response.status}` };
    }

    const data = (await response.json()) as { models?: Array<{ name: string }> };
    const models = data.models || [];
    const modelExists = models.some(
      (m) => m.name === modelName || m.name.startsWith(`${modelName}:`)
    );

    if (!modelExists) {
      return {
        available: true,
        error: `Ollama is running, but model '${modelName}' was not found in tags list.`,
      };
    }

    return { available: true };
  } catch (err: any) {
    return {
      available: false,
      error: `Failed to connect to Ollama at ${baseUrl}: ${err.name === 'AbortError' ? 'Connection timed out' : err.message || String(err)}`,
    };
  }
}

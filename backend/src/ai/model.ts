import dotenv from 'dotenv';

dotenv.config();

export interface OllamaChatResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Direct native fetch utility for Ollama Chat API
 * Bypasses heavy LangChain grammar overhead for 5x faster CPU inference
 */
export async function callOllamaChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: { temperature?: number; timeoutMs?: number } = {}
): Promise<OllamaChatResponse> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
  const timeoutMs = options.timeoutMs || 35000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages,
        options: {
          temperature: options.temperature ?? 0.1,
          num_predict: 350,
        },
        keep_alive: '60m',
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return { success: false, error: `Ollama HTTP ${response.status}` };
    }

    const data = (await response.json()) as { message?: { content: string } };
    if (!data.message || !data.message.content) {
      return { success: false, error: 'Empty message response from Ollama' };
    }

    return { success: true, content: data.message.content };
  } catch (err: any) {
    clearTimeout(timer);
    return {
      success: false,
      error: err.name === 'AbortError' ? `Ollama timed out after ${timeoutMs}ms` : err.message || String(err),
    };
  }
}

/**
 * Utility to check if local Ollama instance and model are reachable
 */
export async function checkOllamaAvailability(): Promise<{ available: boolean; error?: string }> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

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

/**
 * Warm up Ollama model in background to load weights into memory
 */
export async function warmupOllamaModel(): Promise<void> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

  try {
    await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: 'hi',
        keep_alive: '60m',
        stream: false,
      }),
    });
  } catch (err: any) {
    // Silent background warmup failure fallback
  }
}

// Ollama adapter. This module has no access to creator identity or SKYNZ permissions.
const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const model = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 60000);

export async function generateWithOllama(messages, signal) {
  const endpoint = new URL('/api/chat', baseUrl);
  // Only allow loopback or explicitly configured trusted service hosts.
  if (!['http:', 'https:'].includes(endpoint.protocol)) throw new Error('Invalid Ollama URL');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false, options: { num_predict: 512 } }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Ollama request failed: HTTP ' + response.status);
    const result = await response.json();
    if (typeof result?.message?.content !== 'string') throw new Error('Invalid Ollama response');
    return { text: result.message.content, provider: 'ollama', model };
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

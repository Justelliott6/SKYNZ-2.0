import { generateWithOllama } from './ollama.js';

// Stable interface; other provider adapters can be added without changing the route.
const providers = { ollama: generateWithOllama };

export async function generateAssistantReply({ messages, signal }) {
  const provider = process.env.AI_PROVIDER || 'ollama';
  const generate = providers[provider];
  if (!generate) throw new Error('Unsupported AI provider');
  return generate(messages, signal);
}

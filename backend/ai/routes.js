import { Router } from 'express';
import { generateAssistantReply } from './router.js';

export function createAiRouter(verifyToken) {
  const router = Router();
  router.post('/chat', verifyToken, async (req, res) => {
    // No model access without a real server secret; do not trust the dev fallback.
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
      return res.status(503).json({ error: 'AI unavailable: configure JWT_SECRET' });
    }
    const { message } = req.body || {};
    if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
      return res.status(400).json({ error: 'message must be 1-4000 characters' });
    }
    try {
      // Do not accept creator identity, system prompts, provider URLs, or permissions from clients.
      const result = await generateAssistantReply({
        messages: [
          { role: 'system', content: 'You are a private assistant helping the authenticated SKYNZ creator. Do not claim to have executed actions. Ask for authorization before any consequential action.' },
          { role: 'user', content: message.trim() }
        ]
      });
      return res.json({ reply: result.text, provider: result.provider, model: result.model });
    } catch (error) {
      console.error('AI connector error:', error.message);
      return res.status(502).json({ error: 'AI provider unavailable' });
    }
  });
  return router;
}

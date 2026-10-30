import { Router } from 'express';
import { randomUUID } from 'node:crypto';

// Mount with an authenticated creator identity and a PostgreSQL pool.
// Existing public page routes remain unchanged.
export function creatorRoutes(pool, verifyToken) {
  const router = Router();
  router.use(verifyToken);
  router.get('/:id', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM pages WHERE id = $1 AND creator_id = $2', [req.params.id, req.creatorId]);
      if (!rows.length) return res.status(404).json({ error: 'Page not found' });
      res.json(rows[0]);
    } catch (error) { res.status(500).json({ error: 'Unable to load page' }); }
  });
  router.post('/draft', async (req, res) => {
    const { title, handle, description = '', platforms = [], embed_url = null, affiliate_link = null } = req.body || {};
    if (typeof title !== 'string' || !title.trim() || typeof handle !== 'string' || !/^[a-z0-9-]{3,48}$/.test(handle))
      return res.status(400).json({ error: 'Valid title and handle required' });
    if (!Array.isArray(platforms) || !platforms.every(p => typeof p === 'string'))
      return res.status(400).json({ error: 'Invalid platforms' });
    try {
      const { rows } = await pool.query(
        'INSERT INTO pages (id, creator_id, title, handle, description, platforms, embed_url, affiliate_link, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *',
        [randomUUID(), req.creatorId, title.trim(), handle, description, JSON.stringify(platforms), embed_url, affiliate_link]
      );
      res.status(201).json({ page: rows[0], minted: false });
    } catch (error) {
      res.status(error.code === '23505' ? 409 : 500).json({ error: error.code === '23505' ? 'Handle already taken' : 'Unable to save draft' });
    }
  });
  return router;
}

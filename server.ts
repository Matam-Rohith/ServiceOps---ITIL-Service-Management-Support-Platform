import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { getDbIncidents, insertDbIncident, getDbComments, insertDbComment } from './src/db/incidents.ts';

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, name, picture } = (req.user || {}) as any;
      const user = await getOrCreateUser(
        uid,
        email || '',
        name || req.body.name,
        picture || req.body.avatarUrl
      );
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  app.get('/api/incidents', async (_req, res) => {
    try {
      const records = await getDbIncidents();
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch incidents' });
    }
  });

  app.post('/api/incidents', requireAuth, async (req: AuthRequest, res) => {
    try {
      const saved = await insertDbIncident(req.body);
      res.status(201).json(saved);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create incident' });
    }
  });

  app.get('/api/incidents/:id/comments', async (req, res) => {
    try {
      const comments = await getDbComments(req.params.id);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch comments' });
    }
  });

  app.post('/api/incidents/:id/comments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const saved = await insertDbComment({
        ...req.body,
        incidentId: req.params.id,
      });
      res.status(201).json(saved);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to add comment' });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ServiceOps server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

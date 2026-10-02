import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

import adminLoginHandler from './api/admin/login';
import adminVerifyHandler from './api/admin/verify';
import adminStatusHandler from './api/admin/status';
import enquiryNotifyHandler from './api/enquiry/notify';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'THE GRID API' });
  });

  // Enquiry & Lead Email Alert Notification Endpoint
  app.post('/api/enquiry/notify', (req, res) => enquiryNotifyHandler(req, res));
  app.post('/api/enquiries', (req, res) => enquiryNotifyHandler(req, res));

  // Admin authentication endpoints
  app.post('/api/admin/login', (req, res) => adminLoginHandler(req, res));
  app.get('/api/admin/verify', (req, res) => adminVerifyHandler(req, res));
  app.post('/api/admin/verify', (req, res) => adminVerifyHandler(req, res));
  app.get('/api/admin/status', (req, res) => adminStatusHandler(req, res));

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import type { Request, Response } from 'express';

function cleanEnv(val?: string): string {
  if (!val) return '';
  return val.replace(/^["']|["']$/g, '').trim();
}

function getExpectedCredentials() {
  const envEmail = cleanEnv(process.env.ADMIN_EMAIL) || cleanEnv(process.env.VITE_ADMIN_EMAIL);
  const envPassword = cleanEnv(process.env.ADMIN_PASSWORD) || cleanEnv(process.env.VITE_ADMIN_PASSWORD);
  const isCustomConfigured = Boolean(envEmail && envPassword);
  return { isCustomConfigured };
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { isCustomConfigured } = getExpectedCredentials();
  return res.status(200).json({
    status: 'ok',
    isCustomConfigured,
    authMode: 'process.env.ADMIN_EMAIL & process.env.ADMIN_PASSWORD',
  });
}

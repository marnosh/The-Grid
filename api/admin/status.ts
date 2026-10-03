import type { Request, Response } from 'express';
import { getExpectedCredentials } from '../_lib/auth';

export default async function handler(req: Request, res: Response) {
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

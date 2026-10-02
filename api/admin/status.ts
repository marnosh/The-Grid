import type { Request, Response } from 'express';
import { getExpectedCredentials } from '../../src/server/auth';

export default async function handler(req: Request, res: Response) {
  const { isCustomConfigured } = getExpectedCredentials();
  return res.status(200).json({
    status: 'ok',
    isCustomConfigured,
    authMode: 'process.env.ADMIN_EMAIL & process.env.ADMIN_PASSWORD',
  });
}

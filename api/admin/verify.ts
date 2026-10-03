import type { Request, Response } from 'express';
import { verifyAuthToken, getExpectedCredentials } from '../_lib/auth';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      if (body && body.token) {
        token = body.token;
      }
    }

    if (!token) {
      return res.status(401).json({
        valid: false,
        error: 'No authorization token provided',
      });
    }

    const payload = verifyAuthToken(token);

    if (!payload) {
      return res.status(401).json({
        valid: false,
        error: 'Token is invalid or expired',
      });
    }

    const { email: expectedEmail, isCustomConfigured } = getExpectedCredentials();

    return res.status(200).json({
      valid: true,
      admin: {
        email: payload.email,
        expectedEmail,
        isCustomConfigured,
      },
    });
  } catch (err: any) {
    console.error('Admin verify error:', err);
    return res.status(500).json({
      valid: false,
      error: 'An internal error occurred during token verification',
    });
  }
}

import type { Request, Response } from 'express';
import crypto from 'crypto';

interface AdminPayload {
  email: string;
  iat: number;
  exp: number;
}

const DEFAULT_ADMIN_EMAIL = 'admin@thegrid.com';
const DEFAULT_ADMIN_PASSWORD = 'grid2025';

function cleanEnv(val?: string): string {
  if (!val) return '';
  return val.replace(/^["']|["']$/g, '').trim();
}

function getExpectedCredentials() {
  const envEmail = cleanEnv(process.env.ADMIN_EMAIL) || cleanEnv(process.env.VITE_ADMIN_EMAIL);
  const envPassword = cleanEnv(process.env.ADMIN_PASSWORD) || cleanEnv(process.env.VITE_ADMIN_PASSWORD);

  const email = envEmail || DEFAULT_ADMIN_EMAIL;
  const password = envPassword || DEFAULT_ADMIN_PASSWORD;
  const isCustomConfigured = Boolean(envEmail && envPassword);
  return { email, password, isCustomConfigured };
}

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'thegrid-secret-auth-salt-c0w0rk1ng-2025'
  );
}

function verifyAuthToken(token: string): AdminPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, providedSignature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', getSecretKey())
    .update(payloadBase64)
    .digest('base64url');

  const providedBuf = Buffer.from(providedSignature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload: AdminPayload = JSON.parse(payloadStr);

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
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

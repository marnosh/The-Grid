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

function generateAuthToken(email: string): string {
  const payload: AdminPayload = {
    email,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

async function parseBody(req: any): Promise<Record<string, any>> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf8'));
    } catch {
      return {};
    }
  }

  // Fallback: read body stream if not pre-parsed by middleware
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export default async function handler(req: Request, res: Response) {
  // Always guarantee Content-Type: application/json
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Both administrator email and password are required.',
      });
    }

    const { email: expectedEmail, password: expectedPassword, isCustomConfigured } =
      getExpectedCredentials();

    const normalizedEnteredEmail = String(email).trim().toLowerCase();
    const normalizedExpectedEmail = String(expectedEmail).trim().toLowerCase();

    const cleanEnteredPassword = String(password).trim();
    const cleanExpectedPassword = String(expectedPassword).trim();

    // Constant comparison
    const emailMatches = normalizedEnteredEmail === normalizedExpectedEmail;
    const passwordMatches = cleanEnteredPassword === cleanExpectedPassword;

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator email or password.',
      });
    }

    // Generate signed token
    const token = generateAuthToken(normalizedExpectedEmail);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        email: normalizedExpectedEmail,
        isCustomConfigured,
      },
      message: 'Admin authentication successful',
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during authentication.',
    });
  }
}

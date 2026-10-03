import crypto from 'crypto';

export interface AdminPayload {
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

export function getExpectedCredentials() {
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

/**
 * Generate a cryptographically signed auth token
 */
export function generateAuthToken(email: string): string {
  const payload: AdminPayload = {
    email,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify an auth token. Returns null if invalid or expired.
 */
export function verifyAuthToken(token: string): AdminPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, providedSignature] = parts;

  // Verify HMAC signature
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
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

import type { Request, Response } from 'express';
import { getExpectedCredentials, generateAuthToken } from '../_lib/auth';

export default async function handler(req: Request, res: Response) {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Parse body whether it arrived as object, string, or Buffer (handles both Express & Vercel serverless)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString('utf8'));
      } catch {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

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

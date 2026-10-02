import type { Request, Response } from 'express';
import { getExpectedCredentials, generateAuthToken } from '../../src/server/auth';

export default async function handler(req: Request, res: Response) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Both email and password are required',
      });
    }

    const { email: expectedEmail, password: expectedPassword, isCustomConfigured } =
      getExpectedCredentials();

    const normalizedEnteredEmail = String(email).trim().toLowerCase();
    const normalizedExpectedEmail = expectedEmail.trim().toLowerCase();

    // Constant-length / strict comparison
    const emailMatches = normalizedEnteredEmail === normalizedExpectedEmail;
    const passwordMatches = String(password) === expectedPassword;

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator email or password',
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
      error: 'An internal error occurred during authentication',
    });
  }
}

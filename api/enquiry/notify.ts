import type { Request, Response } from 'express';
import { sendEnquiryEmailAlert, getNotificationEmail } from '../../src/server/emailService';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, spaceType, seatsNeeded, message, createdAt } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone number are required for lead notifications.',
      });
    }

    const emailResult = await sendEnquiryEmailAlert({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      spaceType: String(spaceType || 'Hot desk'),
      seatsNeeded: String(seatsNeeded || '1 seat'),
      message: message ? String(message).trim() : undefined,
      createdAt: createdAt || new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      deliveredTo: getNotificationEmail(),
      simulated: emailResult.simulated || false,
      messageId: emailResult.messageId,
      message: `Enquiry notification dispatched to ${getNotificationEmail()}`,
    });
  } catch (err: any) {
    console.error('Error handling enquiry notification:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the enquiry notification.',
    });
  }
}

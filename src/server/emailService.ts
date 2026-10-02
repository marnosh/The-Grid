import nodemailer from 'nodemailer';

export interface EnquiryEmailData {
  name: string;
  phone: string;
  email?: string;
  spaceType: string;
  seatsNeeded: string;
  message?: string;
  createdAt?: string;
}

const DEFAULT_NOTIFICATION_EMAIL = 'thegridbycastillo@gmail.com';

export function getNotificationEmail(): string {
  return process.env.NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL;
}

export function generateEnquiryEmailHtml(data: EnquiryEmailData): string {
  const cleanPhone = data.phone.replace(/[^0-9+]/g, '');
  const waPhone = cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') : `91${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hello ${data.name}, thank you for contacting THE GRID Coworking at Hilite Business Park, Calicut. We received your enquiry for ${data.spaceType} (${data.seatsNeeded}).`
  )}`;
  const callUrl = `tel:${cleanPhone}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Workspace Enquiry - THE GRID</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f5fa; margin: 0; padding: 24px; color: #212121; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: #212121; padding: 28px 24px; text-align: center; color: #ffffff; }
    .logo-badge { display: inline-block; background: #EFF0A3; color: #212121; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .title { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .subtitle { margin: 6px 0 0 0; font-size: 12px; color: #a1a1aa; }
    .content { padding: 28px 24px; }
    .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; background: #CFDECA; color: #212121; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
    .card { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eeeeee; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #71717a; font-weight: 600; }
    .value { color: #212121; font-weight: 700; text-align: right; }
    .note-box { background: #f4f4f5; border-left: 3px solid #EFF0A3; padding: 12px 14px; border-radius: 4px; font-size: 13px; color: #3f3f46; margin-top: 14px; font-style: italic; }
    .btn-group { display: flex; gap: 12px; margin-top: 24px; }
    .btn { flex: 1; text-align: center; padding: 12px 16px; border-radius: 30px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block; }
    .btn-wa { background: #25D366; color: #ffffff; }
    .btn-call { background: #212121; color: #ffffff; }
    .footer { background: #fafafa; border-top: 1px solid #f4f4f5; padding: 16px 24px; text-align: center; font-size: 11px; color: #a1a1aa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">THE GRID · CALICUT</div>
      <h1 class="title">New Workspace Enquiry</h1>
      <p class="subtitle">Hilite Business Park, Phase 2, 1st Floor</p>
    </div>

    <div class="content">
      <div class="status-pill">⚡ Action Required: New Prospect Lead</div>

      <div class="card">
        <div class="row">
          <span class="label">Customer Name:</span>
          <span class="value">${data.name}</span>
        </div>
        <div class="row">
          <span class="label">Phone / WhatsApp:</span>
          <span class="value">${data.phone}</span>
        </div>
        ${data.email ? `
        <div class="row">
          <span class="label">Email:</span>
          <span class="value">${data.email}</span>
        </div>` : ''}
        <div class="row">
          <span class="label">Workspace Type:</span>
          <span class="value" style="color: #059669;">${data.spaceType}</span>
        </div>
        <div class="row">
          <span class="label">Number of Seats:</span>
          <span class="value">${data.seatsNeeded}</span>
        </div>
        <div class="row">
          <span class="label">Received At:</span>
          <span class="value">${data.createdAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        </div>

        ${data.message ? `
        <div class="note-box">
          <strong>Customer Notes:</strong><br/>
          "${data.message}"
        </div>` : ''}
      </div>

      <div class="btn-group">
        <a href="${whatsappUrl}" class="btn btn-wa" target="_blank">Chat on WhatsApp</a>
        <a href="${callUrl}" class="btn btn-call">Call Customer</a>
      </div>
    </div>

    <div class="footer">
      Automated Lead Notification · Sent to <strong>${getNotificationEmail()}</strong><br/>
      THE GRID Coworking Space, Powered by Castillo
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatch automated email alert to the configured email
 */
export async function sendEnquiryEmailAlert(data: EnquiryEmailData): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  recipient: string;
  error?: string;
}> {
  const recipient = getNotificationEmail();
  const subject = `🔥 New Lead: ${data.name} (${data.spaceType}, ${data.seatsNeeded}) - THE GRID`;
  const html = generateEnquiryEmailHtml(data);

  // 1. Try Resend API if RESEND_API_KEY is configured (recommended for modern Vercel/Node deployments)
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.SENDER_EMAIL || 'THE GRID Alerts <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipient],
          subject,
          html,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        console.log(`[EMAIL DISPATCHED via Resend] ID: ${resData.id} to ${recipient}`);
        return { success: true, messageId: resData.id, recipient };
      } else {
        console.warn('[Resend API Error]', resData);
      }
    } catch (err: any) {
      console.error('[Resend Error]', err);
    }
  }

  // 2. Try Nodemailer SMTP if SMTP_HOST or EMAIL_USER/PASS is configured
  const smtpHost = process.env.SMTP_HOST || (process.env.SMTP_USER?.includes('@gmail.com') ? 'smtp.gmail.com' : undefined);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true' || (Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT),
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL || `"THE GRID Alerts" <${smtpUser}>`,
        to: recipient,
        subject,
        html,
      });

      console.log(`[EMAIL DISPATCHED via SMTP] ID: ${info.messageId} to ${recipient}`);
      return { success: true, messageId: info.messageId, recipient };
    } catch (err: any) {
      console.error('[SMTP Send Error]', err);
    }
  }

  // 3. Fallback: Log email details cleanly to server console
  console.log(`\n======================================================`);
  console.log(`📧 [AUTOMATED EMAIL ALERT PREVIEW]`);
  console.log(`To: ${recipient}`);
  console.log(`Subject: ${subject}`);
  console.log(`Lead: ${data.name} | Phone: ${data.phone} | Space: ${data.spaceType} (${data.seatsNeeded})`);
  console.log(`Notes: ${data.message || 'None'}`);
  console.log(`To send live emails, set RESEND_API_KEY or SMTP credentials in your environment variables.`);
  console.log(`======================================================\n`);

  return {
    success: true,
    simulated: true,
    recipient,
  };
}

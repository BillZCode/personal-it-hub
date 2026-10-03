import { Request, Response } from 'express';
import { asyncHandler } from '../middleware';
import nodemailer from 'nodemailer';
import { config } from '../config';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const contactController = {
  submit: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    const safeName = escapeHtml(String(name || ''));
    const safeEmail = escapeHtml(String(email || ''));
    const safeMessage = escapeHtml(String(message || '')).replace(/\n/g, '<br>');

    // In production, send actual email
    if (config.email.user && config.email.pass) {
      const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465,
        auth: { user: config.email.user, pass: config.email.pass },
      });

      await transporter.sendMail({
        from: config.email.from,
        to: config.email.user,
        subject: `Contact Form: ${safeName}`,
        text: `From: ${name} (${email})\n\n${message}`,
        html: `<p><strong>From:</strong> ${safeName} (${safeEmail})</p><p>${safeMessage}</p>`,
      });
    } else {
      console.log('Contact form submission (email not configured):', { name, email, message });
    }

    res.json({ success: true });
  }),
};
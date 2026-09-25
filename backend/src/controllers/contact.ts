import { Request, Response } from 'express';
import { asyncHandler } from '../middleware';
import nodemailer from 'nodemailer';
import { config } from '../config';

export const contactController = {
  submit: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

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
        subject: `Contact Form: ${name}`,
        text: `From: ${name} (${email})\n\n${message}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br>')}</p>`,
      });
    } else {
      console.log('Contact form submission (email not configured):', { name, email, message });
    }

    res.json({ success: true });
  }),
};
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
      try {
        const transporter = nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.port === 465,
          auth: { user: config.email.user, pass: config.email.pass },
        });

        await transporter.sendMail({
          from: config.email.from || `"IT-Hub Contact" <${config.email.user}>`,
          to: config.email.to || config.email.user,
          replyTo: email,
          subject: `[IT-Hub] Pesan Kontak Baru dari: ${safeName}`,
          text: `Pesan baru dari formulir kontak website:\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0b0f19; color: #e2e8f0;">
              <h2 style="color: #f59e0b; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 12px;">Pesan Kontak Baru — Personal IT Hub</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; width: 80px; font-weight: bold;">Nama:</td>
                  <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-weight: bold;">Email:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a></td>
                </tr>
              </table>
              <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
                <p style="margin: 0; white-space: pre-wrap; color: #f1f5f9; line-height: 1.6;">${safeMessage}</p>
              </div>
              <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">Anda dapat langsung membalas email ini untuk merespons ke pengirim (${safeEmail}).</p>
            </div>
          `,
        });
        console.log(`[Contact] Email berhasil dikirim ke ${config.email.to || config.email.user} dari ${email}`);
      } catch (err) {
        console.error('[Contact] Gagal mengirim email via SMTP:', err);
        // Fallback log jika pengiriman gagal agar pesan tidak hilang
        console.log('[Contact Fallback Log]:', { name, email, message });
      }
    } else {
      console.log('Contact form submission (email not configured):', { name, email, message });
    }

    res.json({ success: true });
  }),
};
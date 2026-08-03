import nodemailer from 'nodemailer';

let transporter = null;

/* Build a transporter lazily. If SMTP_HOST is empty we run in "log only"
   mode so the app works out-of-the-box in development without credentials. */
const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

/**
 * Send an email. Resolves to { sent: boolean }.
 * Never throws to the caller — a contact submission must still succeed
 * (and be stored) even if the mail server is down.
 */
export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const tx = getTransporter();
  if (!tx) {
    console.log(`[email] SMTP not configured — skipping send. Subject: "${subject}"`);
    return { sent: false, skipped: true };
  }
  try {
    await tx.sendMail({
      from: process.env.MAIL_FROM || 'NLCS Website <no-reply@nlcsitservice.com>',
      to: to || process.env.MAIL_TO,
      subject,
      text,
      html,
      replyTo,
    });
    return { sent: true };
  } catch (err) {
    console.error(`[email] send failed: ${err.message}`);
    return { sent: false, error: err.message };
  }
};

export const contactNotificationTemplate = (c) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e9f5;border-radius:14px;overflow:hidden">
   <div style="background:#0A1230;color:#fff;padding:22px 26px">
      <h2 style="margin:0;font-size:18px">New enquiry — NLCS website</h2>
    </div>
    <div style="padding:24px 26px;color:#0A1230">
      <p style="margin:0 0 14px"><b>Name:</b> ${c.name}</p>
      <p style="margin:0 0 14px"><b>Email:</b> ${c.email}</p>
      <p style="margin:0 0 14px"><b>Phone:</b> ${c.phone || '—'}</p>
      <p style="margin:0 0 14px"><b>Service:</b> ${c.service || '—'}</p>
      <p style="margin:0 0 6px"><b>Message:</b></p>
      <div style="background:#f4f7fc;border-radius:10px;padding:14px;white-space:pre-wrap">${c.message}</div>
    </div>
  </div>`;
export const resetPasswordTemplate = (user, resetUrl) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e9f5;border-radius:14px;overflow:hidden">
   <div style="background:#0A1230;color:#fff;padding:22px 26px">
      <h2 style="margin:0;font-size:18px">Reset your NLCITS admin password</h2>
    </div>
    <div style="padding:24px 26px;color:#0A1230">
      <p style="margin:0 0 14px">Hi ${user.name},</p>
      <p style="margin:0 0 18px">We received a request to reset the password for this admin account. This link expires in 30 minutes.</p>
     <p style="margin:0 0 18px">
        <a href="${resetUrl}" style="background:#C8102E;color:#fff;text-decoration:none;padding:12px 22px;border-radius:100px;display:inline-block;font-weight:600">Reset password</a>
      </p>
     <p style="margin:0 0 8px;color:#5B6680;font-size:13px">If you didn't request this, you can safely ignore this email — your password won't be changed.</p>
      <p style="margin:0;color:#5B6680;font-size:12.5px;word-break:break-all">Or paste this link into your browser: ${resetUrl}</p>
    </div>
  </div>`;
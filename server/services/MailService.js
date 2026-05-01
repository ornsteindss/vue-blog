const nodemailer = require('nodemailer');

let _transporter = null;
let _preview = false;

async function getTransporter() {
  if (_transporter) return { transporter: _transporter, preview: _preview };

  if (process.env.NODE_ENV !== 'production') {
    const account = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: account.user, pass: account.pass },
    });
    _preview = true;
    console.log('Ethereal test account ready:', account.user);
  } else {
    _transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  return { transporter: _transporter, preview: _preview };
}

module.exports = {
  async sendPasswordReset(to, token) {
    const base = process.env.APP_URL || 'http://localhost:1337';
    const resetUrl = `${base}/reset-password/${token}`;
    const { transporter, preview } = await getTransporter();

    const info = await transporter.sendMail({
      from:    `"Vue Blog" <${process.env.SMTP_FROM || 'noreply@vueblog.com'}>`,
      to,
      subject: 'Reset your password',
      text:    `Reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="margin-bottom:8px">Reset your password</h2>
          <p style="color:#555">Click the button below. The link expires in 1 hour.</p>
          <a href="${resetUrl}"
            style="display:inline-block;margin:16px 0;padding:10px 24px;background:#1a1a2e;
                    color:#fff;text-decoration:none;border-radius:6px;font-size:15px">
            Reset Password
          </a>
          <p style="color:#aaa;font-size:13px">Or copy this link:<br>${resetUrl}</p>
        </div>
      `,
    });

    if (preview) {
      console.log('Password reset email preview:', nodemailer.getTestMessageUrl(info));
    }
  },
};

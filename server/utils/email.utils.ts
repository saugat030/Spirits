import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (
  to: string,
  otp: string,
  purpose: "verify" | "reset"
): Promise<void> => {
  const subject =
    purpose === "verify"
      ? "Verify your Spirits account"
      : "Reset your Spirits password";

  const actionText =
    purpose === "verify"
      ? "verify your email address"
      : "reset your password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a;">Spirits</h2>
      <p>Use the following OTP code to ${actionText}:</p>
      <div style="background: #f4f4f4; padding: 16px; text-align: center; border-radius: 8px; margin: 16px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #333;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
      <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Spirits" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

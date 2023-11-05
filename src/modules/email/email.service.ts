import nodemailer from 'nodemailer';
import config from '../../config/config';
import logger from '../logger/logger';
import { Message } from './email.interfaces';

export const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  const msg: Message = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Password Reset';
  // Replace this URL with a link to your frontend application's password reset page
  const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const text = `Hello,
  To reset your password, please follow this link: ${resetPasswordUrl}
  If you didn't request a password reset, please disregard this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear User,</strong></h4>
  <p>To reset your password, please click on this link: ${resetPasswordUrl}</p>
  <p>If you didn't request a password reset, please ignore this email.</p>
  <p>Thank you,</p>
  <p><strong>The Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Подтверждение почты';
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;

  const text = `Hello, ${name},
    To confirm your email, please click on this link: ${verificationEmailUrl}
    If you didn't create an account, please disregard this email.`;

  const html = `
  <!DOCTYPE html>
  <html lang="*">
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        border: 1px solid #ccc;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h4 {
        font-size: 20px;
        margin-bottom: 15px;
      }

      p {
        font-size: 16px;
        margin-bottom: 10px;
      }

      a {
        color: #007bff;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    </style><title></title>
  </head>
  <body>
    <div class="container">
      <h4>Hello, ${name},</h4>
      <p>To confirm your email, please click on this link: <a href="${verificationEmailUrl}">verify my email</a></p>
      <p>If you didn't create an account, please disregard this email.</p>
    </div>
  </body>
  </html>
  `;

  await sendEmail(to, subject, text, html);
};

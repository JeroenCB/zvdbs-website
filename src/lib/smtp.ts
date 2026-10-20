/**
 * Verstuurt e-mail via SMTP (de mailserver van de hoster, met een eigen mailbox).
 * Alleen server-side gebruiken, nooit importeren in een 'use client' component.
 *
 * Environment variables (zie .env.example):
 * - SMTP_HOST      bijv. mail.hostingserver.nl
 * - SMTP_PORT      standaard 465 (SSL)
 * - SMTP_USER      volledige mailbox-naam, bijv. website@zvdbs.nl
 * - SMTP_PASSWORD  wachtwoord van die mailbox (alleen in Vercel, nooit committen)
 * - SMTP_FROM      optioneel afzenderadres, standaard gelijk aan SMTP_USER
 */
import nodemailer from 'nodemailer';
import type { MailOptions } from './mail-types';

export function smtpGeconfigureerd(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export async function sendViaSmtp({ to, subject, htmlContent, replyTo }: MailOptions): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) throw new Error('SMTP is niet volledig ingesteld');

  const port = Number(process.env.SMTP_PORT || 465);
  const afzender = process.env.SMTP_FROM || user;
  const afzenderNaam = process.env.BREVO_SENDER_NAME || 'ZVDBS website';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  });

  await transporter.sendMail({
    from: { name: afzenderNaam, address: afzender },
    to: to.map((ontvanger) => ({ name: ontvanger.name ?? '', address: ontvanger.email })),
    subject,
    html: htmlContent,
    ...(replyTo ? { replyTo: { name: replyTo.name ?? '', address: replyTo.email } } : {}),
  });
}

/**
 * Verstuurt transactionele e-mail via Brevo (voorheen Sendinblue).
 * De API-key blijft altijd server-side. Nooit importeren in een 'use client' component.
 *
 * Benodigde environment variables (zie .env.example en BREVO_SETUP.md):
 * - BREVO_API_KEY: API-key uit het Brevo dashboard (Settings > SMTP & API > API Keys)
 * - BREVO_SENDER_EMAIL: geverifieerd afzender-e-mailadres in Brevo
 * - BREVO_SENDER_NAME: naam die als afzender getoond wordt (optioneel)
 */

interface BrevoEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export async function sendEmail({ to, subject, htmlContent, replyTo }: BrevoEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'ZVDBS website';

  if (!apiKey) throw new Error('BREVO_API_KEY ontbreekt in de environment variables');
  if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL ontbreekt in de environment variables');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to,
      subject,
      htmlContent,
      ...(replyTo ? { replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Brevo gaf een foutmelding (status ${response.status}): ${body}`);
  }
}

/** Escaped gebruikersinvoer voordat het in HTML e-mailcontent terechtkomt. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

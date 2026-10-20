/**
 * Eén ingang voor het versturen van formulier-mail.
 * Voorkeur: SMTP via de mailserver van de club (geen gedeeld IP, mail blijft bij de hoster).
 * Terugval: Brevo, als SMTP niet is ingesteld of mislukt en Brevo wel is ingesteld.
 */
import { sendEmail as sendViaBrevo, escapeHtml } from './brevo';
import { sendViaSmtp, smtpGeconfigureerd } from './smtp';
import type { MailOptions } from './mail-types';

export { escapeHtml };

export async function sendEmail(options: MailOptions): Promise<void> {
  if (smtpGeconfigureerd()) {
    try {
      await sendViaSmtp(options);
      return;
    } catch (error) {
      // Log de reden (zonder wachtwoord) zodat het in de Vercel-logs terug te vinden is.
      console.error('E-mail: versturen via SMTP mislukt:', error instanceof Error ? error.message : error);
      if (!process.env.BREVO_API_KEY) throw error;
      console.warn('E-mail: terugval op Brevo.');
    }
  }
  await sendViaBrevo(options);
}

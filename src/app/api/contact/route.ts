import { NextResponse } from 'next/server';
import { sendEmail, escapeHtml } from '@/lib/brevo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: { naam?: string; email?: string; bericht?: string };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Ongeldige aanvraag.' }, { status: 400 });
  }

  const naam = (data.naam || '').trim();
  const email = (data.email || '').trim();
  const bericht = (data.bericht || '').trim();

  if (!naam || !email || !bericht) {
    return NextResponse.json({ success: false, error: 'Vul alle verplichte velden in.' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ success: false, error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
  }

  const ontvanger = process.env.CONTACT_TO_EMAIL || 'secretaris@zvdbs.nl';

  try {
    await sendEmail({
      to: [{ email: ontvanger }],
      subject: `Nieuw bericht via het contactformulier van ${naam}`,
      htmlContent: `
        <h2>Nieuw bericht via het contactformulier</h2>
        <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Bericht:</strong></p>
        <p>${escapeHtml(bericht).replace(/\n/g, '<br />')}</p>
      `,
      replyTo: { email, name: naam },
    });
  } catch (error) {
    console.error('Contactformulier: versturen via Brevo mislukt:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'Het versturen is helaas mislukt. Probeer het later opnieuw of mail direct naar secretaris@zvdbs.nl.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { sendEmail, escapeHtml } from '@/lib/brevo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProefzwemmenData {
  naam?: string;
  geboortedatum?: string;
  email?: string;
  telefoon?: string;
  opmerkingen?: string;
}

export async function POST(request: Request) {
  let data: ProefzwemmenData;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Ongeldige aanvraag.' }, { status: 400 });
  }

  const naam = (data.naam || '').trim();
  const geboortedatum = (data.geboortedatum || '').trim();
  const email = (data.email || '').trim();
  const telefoon = (data.telefoon || '').trim();
  const opmerkingen = (data.opmerkingen || '').trim();

  if (!naam || !geboortedatum || !email || !telefoon) {
    return NextResponse.json({ success: false, error: 'Vul alle verplichte velden in.' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ success: false, error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
  }

  const ontvanger = process.env.MEMBERSHIP_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'secretaris@zvdbs.nl';

  try {
    await sendEmail({
      to: [{ email: ontvanger }],
      subject: `Aanmelding proefzwemmen: ${naam}`,
      htmlContent: `
        <h2>Nieuwe aanmelding proefzwemmen</h2>
        <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
        <p><strong>Geboortedatum:</strong> ${escapeHtml(geboortedatum)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefoonnummer:</strong> ${escapeHtml(telefoon)}</p>
        ${opmerkingen ? `<p><strong>Opmerkingen:</strong></p><p>${escapeHtml(opmerkingen).replace(/\n/g, '<br />')}</p>` : ''}
      `,
      replyTo: { email, name: naam },
    });
  } catch (error) {
    console.error('Proefzwemmen: versturen via Brevo mislukt:', error);
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

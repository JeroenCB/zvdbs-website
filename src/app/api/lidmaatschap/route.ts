import { NextResponse } from 'next/server';
import { sendEmail, escapeHtml } from '@/lib/brevo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type VoorWie = 'zelf' | 'minderjarige';
type Geslacht = 'man' | 'vrouw' | 'anders';
type TrainingenPerWeek = '1' | '2';
type JaNee = 'ja' | 'nee';

interface LidmaatschapData {
  voorWie?: string;
  naam?: string;
  geslacht?: string;
  geboortedatum?: string;
  adres?: string;
  postcodeWoonplaats?: string;
  email?: string;
  telefoon?: string;
  trainingenPerWeek?: string;
  opmerkingen?: string;
  akkoordLidwording?: boolean;
  toestemmingFotos?: string;
  toestemmingSponsors?: string;
  toestemmingVideo?: string;
}

const VOOR_WIE_WAARDEN: VoorWie[] = ['zelf', 'minderjarige'];
const GESLACHT_WAARDEN: Geslacht[] = ['man', 'vrouw', 'anders'];
const TRAININGEN_WAARDEN: TrainingenPerWeek[] = ['1', '2'];
const JA_NEE_WAARDEN: JaNee[] = ['ja', 'nee'];

const VOOR_WIE_LABEL: Record<VoorWie, string> = {
  zelf: 'Mijzelf (16 jaar of ouder)',
  minderjarige: 'Een minderjarige (jonger dan 16 jaar)',
};
const GESLACHT_LABEL: Record<Geslacht, string> = {
  man: 'Man',
  vrouw: 'Vrouw',
  anders: 'Anders / wil ik niet aangeven',
};
const TRAININGEN_LABEL: Record<TrainingenPerWeek, string> = {
  '1': '1 keer per week (woensdag of vrijdag)',
  '2': '2 keer per week (woensdag en vrijdag)',
};

export async function POST(request: Request) {
  let data: LidmaatschapData;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Ongeldige aanvraag.' }, { status: 400 });
  }

  const voorWie = (data.voorWie || '').trim() as VoorWie;
  const naam = (data.naam || '').trim();
  const geslacht = (data.geslacht || '').trim() as Geslacht;
  const geboortedatum = (data.geboortedatum || '').trim();
  const adres = (data.adres || '').trim();
  const postcodeWoonplaats = (data.postcodeWoonplaats || '').trim();
  const email = (data.email || '').trim();
  const telefoon = (data.telefoon || '').trim();
  const trainingenPerWeek = (data.trainingenPerWeek || '').trim() as TrainingenPerWeek;
  const opmerkingen = (data.opmerkingen || '').trim();
  const akkoordLidwording = data.akkoordLidwording === true;
  const toestemmingFotos = (data.toestemmingFotos || '').trim() as JaNee;
  const toestemmingSponsors = (data.toestemmingSponsors || '').trim() as JaNee;
  const toestemmingVideo = (data.toestemmingVideo || '').trim() as JaNee;

  if (
    !naam ||
    !geboortedatum ||
    !adres ||
    !postcodeWoonplaats ||
    !email ||
    !telefoon ||
    !VOOR_WIE_WAARDEN.includes(voorWie) ||
    !GESLACHT_WAARDEN.includes(geslacht) ||
    !TRAININGEN_WAARDEN.includes(trainingenPerWeek) ||
    !JA_NEE_WAARDEN.includes(toestemmingFotos) ||
    !JA_NEE_WAARDEN.includes(toestemmingSponsors) ||
    !JA_NEE_WAARDEN.includes(toestemmingVideo)
  ) {
    return NextResponse.json({ success: false, error: 'Vul alle verplichte velden in.' }, { status: 400 });
  }
  if (!akkoordLidwording) {
    return NextResponse.json(
      { success: false, error: 'Je moet akkoord gaan met de lidwordingsverklaring om je aan te melden.' },
      { status: 400 }
    );
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ success: false, error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
  }

  const ontvanger = process.env.MEMBERSHIP_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'secretaris@zvdbs.nl';

  try {
    await sendEmail({
      to: [{ email: ontvanger }],
      subject: `Nieuwe aanmelding lidmaatschap: ${naam}`,
      htmlContent: `
        <h2>Nieuwe aanmelding lidmaatschap</h2>
        <p><strong>Formulier ingevuld voor:</strong> ${escapeHtml(VOOR_WIE_LABEL[voorWie])}</p>
        <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
        <p><strong>Geslacht:</strong> ${escapeHtml(GESLACHT_LABEL[geslacht])}</p>
        <p><strong>Geboortedatum:</strong> ${escapeHtml(geboortedatum)}</p>
        <p><strong>Adres:</strong> ${escapeHtml(adres)}</p>
        <p><strong>Postcode en woonplaats:</strong> ${escapeHtml(postcodeWoonplaats)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefoonnummer:</strong> ${escapeHtml(telefoon)}</p>
        <p><strong>Aantal trainingen per week:</strong> ${escapeHtml(TRAININGEN_LABEL[trainingenPerWeek])}</p>
        ${opmerkingen ? `<p><strong>Opmerkingen:</strong></p><p>${escapeHtml(opmerkingen).replace(/\n/g, '<br />')}</p>` : ''}
        <h3>Lidwordingsverklaring</h3>
        <p>Akkoord met de voorwaarden voor lidmaatschap en opzegging: <strong>Ja</strong></p>
        <h3>Privacytoestemmingen</h3>
        <p><strong>Foto's/filmpjes op website en social media:</strong> ${toestemmingFotos === 'ja' ? 'Ja' : 'Nee'}</p>
        <p><strong>Naam en e-mailadres delen met sponsors:</strong> ${toestemmingSponsors === 'ja' ? 'Ja' : 'Nee'}</p>
        <p><strong>Videomateriaal voor trainingsondersteuning:</strong> ${toestemmingVideo === 'ja' ? 'Ja' : 'Nee'}</p>
      `,
      replyTo: { email, name: naam },
    });
  } catch (error) {
    console.error('Lidmaatschap: versturen via Brevo mislukt:', error);
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

import { NextResponse } from 'next/server';
import { HONEYPOT_VELD, STARTED_AT_VELD, TURNSTILE_VELD } from './antispam-velden';

/** Minimaal aantal milliseconden tussen laden en verzenden van een formulier. */
const MIN_INVULTIJD_MS = 2000;
/** Tolerantie voor klokverschil tussen browser en server. */
const KLOK_TOLERANTIE_MS = 60 * 1000;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface AntispamVelden {
  [HONEYPOT_VELD]?: unknown;
  [STARTED_AT_VELD]?: unknown;
  [TURNSTILE_VELD]?: unknown;
}

function foutantwoord(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

/** Controleert het Turnstile-token bij Cloudflare. Retourneert null als alles in orde is. */
async function controleerTurnstile(token: unknown, request: Request): Promise<NextResponse | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Lokaal ontwikkelen zonder sleutel mag; in productie weigeren we liever alles dan
    // stilletjes zonder bescherming te draaien.
    if (process.env.NODE_ENV !== 'production') return null;
    console.error('Turnstile: TURNSTILE_SECRET_KEY ontbreekt, formulier geweigerd.');
    return foutantwoord(
      'Het formulier is tijdelijk niet beschikbaar. Mail direct naar secretaris@zvdbs.nl.',
      503
    );
  }

  if (typeof token !== 'string' || token.trim() === '' || token.length > 2048) {
    return foutantwoord(
      'De beveiligingscontrole is nog niet afgerond. Wacht even, ververs de pagina en probeer het opnieuw.',
      400
    );
  }

  const body = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip) body.set('remoteip', ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    const result = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (result.success === true) return null;

    console.warn('Turnstile: token afgewezen:', result['error-codes']);
    return foutantwoord(
      'De beveiligingscontrole is mislukt of verlopen. Ververs de pagina en probeer het opnieuw.',
      400
    );
  } catch (error) {
    console.error('Turnstile: verificatie niet mogelijk:', error);
    return foutantwoord(
      'De beveiligingscontrole is tijdelijk niet bereikbaar. Probeer het later opnieuw of mail naar secretaris@zvdbs.nl.',
      503
    );
  }
}

/**
 * Antispam-controle voor de formulier-API's. Retourneert:
 * - een Response als het verzoek niet verwerkt mag worden;
 * - null als het verzoek door mag naar de normale validatie.
 *
 * Lagen: honeypot, minimale invultijd, Cloudflare Turnstile.
 * De honeypot en invultijd stoppen alleen simpele bots; Turnstile is de echte controle.
 */
export async function controleerAntispam(data: unknown, request: Request): Promise<NextResponse | null> {
  const velden = (data && typeof data === 'object' ? data : {}) as AntispamVelden;

  // 1. Honeypot: ingevuld = bot. Doe alsof het gelukt is, zodat de bot niet gaat variëren.
  if (typeof velden[HONEYPOT_VELD] === 'string' && (velden[HONEYPOT_VELD] as string).trim() !== '') {
    return NextResponse.json({ success: true });
  }

  // 2. Invultijd: te snel, ontbrekend of ongeldig tijdstip.
  const startedAt = Number(velden[STARTED_AT_VELD]);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return foutantwoord('Het formulier is verlopen of onvolledig. Ververs de pagina en probeer het opnieuw.', 400);
  }
  const verstreken = Date.now() - startedAt;
  if (verstreken < -KLOK_TOLERANTIE_MS) {
    return NextResponse.json({ success: true }); // tijdstip in de toekomst: vervalst
  }
  if (verstreken < MIN_INVULTIJD_MS) {
    return foutantwoord('Je was erg snel. Wacht even en probeer het opnieuw.', 400);
  }

  // 3. Turnstile.
  return controleerTurnstile(velden[TURNSTILE_VELD], request);
}

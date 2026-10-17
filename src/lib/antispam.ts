import { NextResponse } from 'next/server';
import { HONEYPOT_VELD, STARTED_AT_VELD } from './antispam-velden';

/** Minimaal aantal milliseconden tussen laden en verzenden van een formulier. */
const MIN_INVULTIJD_MS = 2000;
/** Tolerantie voor klokverschil tussen browser en server. */
const KLOK_TOLERANTIE_MS = 60 * 1000;

interface AntispamVelden {
  [HONEYPOT_VELD]?: unknown;
  [STARTED_AT_VELD]?: unknown;
}

/**
 * Basiscontrole tegen simpele bots. Retourneert:
 * - een Response als het verzoek niet verwerkt mag worden (aanvaller krijgt een nep-succes,
 *   echte gebruiker een duidelijke foutmelding);
 * - null als het verzoek door mag naar de normale validatie.
 *
 * Let op: dit stopt alleen bots die het formulier in de browser invullen. Een bot die
 * rechtstreeks naar de API post kan beide velden vervalsen. Daarvoor is Turnstile nodig.
 */
export function controleerAntispam(data: unknown): NextResponse | null {
  const velden = (data && typeof data === 'object' ? data : {}) as AntispamVelden;

  // 1. Honeypot: ingevuld = bot. Doe alsof het gelukt is, zodat de bot niet gaat variëren.
  if (typeof velden[HONEYPOT_VELD] === 'string' && velden[HONEYPOT_VELD].trim() !== '') {
    return NextResponse.json({ success: true });
  }

  // 2. Invultijd: te snel, ontbrekend of ongeldig tijdstip.
  const startedAt = Number(velden[STARTED_AT_VELD]);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Het formulier is verlopen of onvolledig. Ververs de pagina en probeer het opnieuw.',
      },
      { status: 400 }
    );
  }

  const nu = Date.now();
  const verstreken = nu - startedAt;
  if (verstreken < -KLOK_TOLERANTIE_MS) {
    // Tijdstip in de toekomst: vervalst.
    return NextResponse.json({ success: true });
  }
  if (verstreken < MIN_INVULTIJD_MS) {
    return NextResponse.json(
      { success: false, error: 'Je was erg snel. Wacht even en probeer het opnieuw.' },
      { status: 400 }
    );
  }

  return null;
}

import { NextResponse } from 'next/server';
import {
  batchGetRanges,
  parseDutchNumber,
  timeToSeconds,
} from '@/lib/google-sheets';

// Ververst maximaal 1x per 10 minuten. Ruim binnen de gratis Google-quota.
export const revalidate = 600;

/**
 * Tabblad Adelskalender. Koprij = RIJ 4, data vanaf rij 5.
 *
 * A(0)  volgnr        B(1)  ID           C(2)  Naam
 * D(3)  Geslacht      E(4)  Geb.jr.      <- PRIVACY: worden NIET doorgegeven
 * F(5) t/m AB(27)     afstanden
 * AC(28) C.K. 1       AD(29) C.K. 2      AE(30) C.K. 3
 * AF(31) Adelskalender
 * AG(32) lid          AH(33) Aantal wedstrijden   AI(34) Wedstrijdnummer
 * AJ(35) t/m AR(43)   gewicht per klassementsafstand (0 = niet gezwommen)
 * AS(44)              som van die gewichten (max 28 = alle 9 gezwommen)
 */
const RANGE = "'Adelskalender'!A4:AS1000";

const IDX = {
  naam: 2,
  afstandStart: 5,
  afstandEnd: 27,
  ck1: 28,
  ck2: 29,
  ck3: 30,
  adelskalender: 31,
  lid: 32,
  wedstrijden: 33,
  wedstrijdnummer: 34,
  gewichtStart: 35,
  gewichtEnd: 43,
} as const;

/** Scores >= 999 zijn placeholders ("999,99" = geen geldig klassement). */
const PLACEHOLDER_MIN = 999;

/** Aantal afstanden dat meetelt voor het klassement. */
const AANTAL_KLASSEMENTSAFSTANDEN = 9;

export async function GET() {
  try {
    const [rows] = await batchGetRanges([RANGE]);

    if (!rows || rows.length < 2) {
      return NextResponse.json(
        { success: false, error: `Geen data gevonden in bereik ${RANGE}` },
        { status: 502 }
      );
    }

    const headerRow = rows[0];

    const afstanden: { key: string; label: string; idx: number }[] = [];
    for (let i = IDX.afstandStart; i <= IDX.afstandEnd; i++) {
      const label = (headerRow[i] || '').toString().replace(/\s+/g, ' ').trim();
      if (label) afstanden.push({ key: slug(label), label, idx: i });
    }

    const swimmers = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const naam = (row[IDX.naam] || '').toString().trim();
      if (!naam) continue;

      // --- PRIVACY -------------------------------------------------------
      // Kolom D (geslacht) en E (geboortejaar) worden hier weggegooid en
      // komen dus niet in de netwerkresponse terecht. Niet alleen verborgen
      // in de UI, maar echt afwezig in de data die de browser ontvangt.
      // -------------------------------------------------------------------

      const tijden: Record<string, { display: string; seconden: number | null }> = {};
      for (const a of afstanden) {
        const display = (row[a.idx] || '').toString().trim();
        if (display) tijden[a.key] = { display, seconden: timeToSeconds(display) };
      }

      // Tel hoeveel van de 9 klassementsafstanden daadwerkelijk gezwommen zijn.
      let gezwommen = 0;
      for (let i = IDX.gewichtStart; i <= IDX.gewichtEnd; i++) {
        if ((parseDutchNumber(row[i]) ?? 0) > 0) gezwommen++;
      }

      swimmers.push({
        naam,
        lid: normalizeJaNee(row[IDX.lid]),
        wedstrijdnummer: normalizeJaNee(row[IDX.wedstrijdnummer]),
        wedstrijden: parseDutchNumber(row[IDX.wedstrijden]) ?? 0,
        ck1: cleanScore(row[IDX.ck1]),
        ck2: cleanScore(row[IDX.ck2]),
        ck3: cleanScore(row[IDX.ck3]),
        adelskalender: cleanScore(row[IDX.adelskalender]),
        gezwommen,
        totaalAfstanden: AANTAL_KLASSEMENTSAFSTANDEN,
        tijden,
        rang: null as number | null,
      });
    }

    // Standaardsortering: C.K. 2 oplopend. Lager = beter.
    // Zwemmers zonder geldige C.K. 2 hebben geen klassementspositie en gaan
    // onderaan, alfabetisch, zodat ze wel vindbaar blijven.
    swimmers.sort((a, b) => {
      if (a.ck2 === null && b.ck2 === null) return a.naam.localeCompare(b.naam, 'nl');
      if (a.ck2 === null) return 1;
      if (b.ck2 === null) return -1;
      return a.ck2 - b.ck2;
    });

    let rang = 0;
    for (const s of swimmers) {
      if (s.ck2 !== null) s.rang = ++rang;
    }

    return NextResponse.json({
      success: true,
      count: swimmers.length,
      inKlassement: rang,
      afstanden: afstanden.map(({ key, label }) => ({ key, label })),
      swimmers,
      lastFetched: new Date().toISOString(),
      source: 'Google Sheets API (service account, prive sheet)',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende fout';
    console.error('[api/swimmers]', message);
    return NextResponse.json(
      { success: false, error: message, hint: diagnose(message) },
      { status: 500 }
    );
  }
}

function cleanScore(value: unknown): number | null {
  const n = parseDutchNumber(value);
  if (n === null || n >= PLACEHOLDER_MIN) return null;
  return n;
}

function normalizeJaNee(value: unknown): boolean | null {
  const s = (value ?? '').toString().trim().toLowerCase();
  if (s === 'ja') return true;
  if (s === 'nee') return false;
  return null;
}

function slug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function diagnose(message: string): string {
  if (message.includes('not supported for this document'))
    return 'GOOGLE_SHEET_ID wijst naar een geupload Excel-bestand. Het ID van een native Sheet telt 44 tekens.';
  if (message.includes('has not been used in project'))
    return 'De Google Sheets API staat uit. Schakel hem in via de link in het foutbericht.';
  if (message.includes('403'))
    return 'Geen toegang. Deel de Sheet met het service account (rol: Lezer).';
  if (message.includes('404')) return 'Sheet niet gevonden. Controleer GOOGLE_SHEET_ID.';
  if (message.includes('Unable to parse range'))
    return 'Het tabblad heet niet exact "Adelskalender". Controleer de tabbladnaam.';
  if (message.includes('invalid_grant') || message.includes('DECODER'))
    return 'De private key is niet correct opgeslagen. Plak de volledige waarde inclusief BEGIN/END regels.';
  return 'Zie het foutbericht hierboven.';
}

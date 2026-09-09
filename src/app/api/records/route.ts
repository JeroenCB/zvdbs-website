import { NextResponse } from 'next/server';
import { batchGetRanges } from '@/lib/google-sheets';

export const revalidate = 600;

/**
 * De vijf slagtabbladen hebben allemaal dezelfde opzet:
 * A Categorie | B Afstand | C Naam | D Tijd | E Datum | F Plaats
 * Koprij = rij 1, data vanaf rij 2.
 */
const SLAGEN = [
  { tab: 'Vlinderslag', label: 'Vlinderslag' },
  { tab: 'Rugcrawl', label: 'Rugslag' },
  { tab: 'Schoolslag', label: 'Schoolslag' },
  { tab: 'Borstcrawl', label: 'Vrije slag' },
  { tab: 'Wisselslag', label: 'Wisselslag' },
] as const;

const COL = { categorie: 0, afstand: 1, naam: 2, tijd: 3, datum: 4, plaats: 5 };

interface ClubRecord {
  id: string;
  slag: string;
  categorie: string;
  afstand: string;
  naam: string;
  tijd: string;
  datum: string;
  plaats: string;
}

/** Vaste volgorde: jongens, meisjes, volwassenen. Bepaalt de sortering in de UI. */
const CATEGORIE_VOLGORDE = [
  'JO08', 'JO10', 'JO12', 'JO14', 'JO16', 'JO18', 'Heren',
  'MO08', 'MO10', 'MO12', 'MO14', 'MO16', 'MO18', 'Dames',
];

function diagnose(message: string): string {
  if (message.includes('ontbreekt'))
    return 'Een omgevingsvariabele is niet ingesteld. Controleer in Vercel onder Settings > Environment Variables of GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL en GOOGLE_PRIVATE_KEY er alle drie staan met Production aangevinkt, en doe daarna een Redeploy.';
  if (message.includes('Unable to parse range'))
    return 'Een van de tabbladen heet niet zoals verwacht. Controleer: Vlinderslag, Rugcrawl, Schoolslag, Borstcrawl, Wisselslag.';
  if (message.includes('has not been used in project'))
    return 'De Google Sheets API staat uit in je Cloud-project.';
  if (message.includes('403'))
    return 'Geen toegang. Deel de Sheet met het service account (rol: Lezer).';
  return message;
}

export async function GET() {
  try {
    const ranges = SLAGEN.map((s) => `'${s.tab}'!A1:F300`);
    const resultaten = await batchGetRanges(ranges);

    const records: ClubRecord[] = [];

    for (let i = 0; i < SLAGEN.length; i++) {
      const slag = SLAGEN[i];
      const rows = resultaten[i] || [];

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const naam = (row[COL.naam] || '').toString().trim();
        const tijd = (row[COL.tijd] || '').toString().trim();

        // Lege regels overslaan. Niet elke categorie heeft op elke afstand
        // een record (bv. JO08 wisselslag staat leeg in de sheet).
        if (!naam || !tijd) continue;

        records.push({
          id: `${slag.tab}-${r}`,
          slag: slag.label,
          categorie: (row[COL.categorie] || '').toString().trim(),
          afstand: (row[COL.afstand] || '').toString().trim(),
          naam,
          tijd,
          datum: (row[COL.datum] || '').toString().trim(),
          plaats: (row[COL.plaats] || '').toString().trim(),
        });
      }
    }

    const categorieen = CATEGORIE_VOLGORDE.filter((c) =>
      records.some((r) => r.categorie === c)
    );
    // Categorieen die niet in de vaste lijst staan alsnog achteraan toevoegen,
    // zodat nieuwe categorieen in de sheet niet stilzwijgend verdwijnen.
    for (const r of records) {
      if (r.categorie && !categorieen.includes(r.categorie)) categorieen.push(r.categorie);
    }

    const afstanden = [...new Set(records.map((r) => r.afstand))].sort((a, b) => {
      const na = parseInt(a, 10) || 0;
      const nb = parseInt(b, 10) || 0;
      return na - nb || a.localeCompare(b, 'nl');
    });

    return NextResponse.json({
      success: true,
      count: records.length,
      slagen: SLAGEN.map((s) => s.label),
      categorieen,
      afstanden,
      records,
      lastFetched: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende fout';
    console.error('[api/records]', message);
    return NextResponse.json(
      {
        success: false,
        error: message,
        hint: diagnose(message),
      },
      { status: 500 }
    );
  }
}

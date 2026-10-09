/** Minimale velden die nodig zijn om records in wedstrijden te groeperen. */
export interface RecordMetDatum {
  datum: string;
  plaats: string;
  categorie: string;
}

const DAG_MS = 24 * 60 * 60 * 1000;
/** Datums die hooguit zoveel dagen uit elkaar liggen horen bij dezelfde wedstrijd(dag). */
const MAX_DAGEN_TUSSEN = 3;

/**
 * De sheet bevat datums als tekst (dd/mm/jjjj, soms zonder voorloopnullen).
 * Alles wat niet te lezen is geeft null en telt dus nergens mee.
 */
function parseDatum(tekst: string): Date | null {
  const m = tekst.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!m) return null;
  const dag = Number(m[1]);
  const maand = Number(m[2]);
  const jaar = Number(m[3]);
  const d = new Date(Date.UTC(jaar, maand - 1, dag));
  // Weigert onmogelijke datums zoals 31/02 (Date zou die stilletjes doorschuiven).
  if (d.getUTCFullYear() !== jaar || d.getUTCMonth() !== maand - 1 || d.getUTCDate() !== dag) {
    return null;
  }
  return d;
}

function formatDag(d: Date, metJaar: boolean): string {
  return d.toLocaleDateString('nl-NL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(metJaar ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });
}

export interface LaatsteWedstrijd<T> {
  records: T[];
  titel: string;
  plaatsen: string[];
}

/**
 * Zoekt de records van de laatste wedstrijd(dag): begint bij de nieuwste datum en
 * neemt eerdere datums mee zolang het gat met de vorige hooguit MAX_DAGEN_TUSSEN is
 * (een landelijke competitie beslaat meerdere dagen). Datums in de toekomst worden
 * genegeerd, zodat een typfout in het jaartal de kop niet kaapt.
 */
export function bepaalLaatsteWedstrijd<T extends RecordMetDatum>(
  records: T[]
): LaatsteWedstrijd<T> | null {
  const grens = Date.now() + DAG_MS;
  const metDatum = records
    .map((r) => ({ r, d: parseDatum(r.datum) }))
    .filter((x): x is { r: T; d: Date } => x.d !== null && x.d.getTime() <= grens);
  if (metDatum.length === 0) return null;

  const dagen = [...new Set(metDatum.map((x) => x.d.getTime()))].sort((a, b) => b - a);
  const groep = [dagen[0]];
  for (let i = 1; i < dagen.length; i++) {
    if (groep[groep.length - 1] - dagen[i] <= MAX_DAGEN_TUSSEN * DAG_MS) groep.push(dagen[i]);
    else break;
  }
  const vanaf = groep[groep.length - 1];
  const tot = groep[0];

  const gekozen = metDatum
    .filter((x) => x.d.getTime() >= vanaf && x.d.getTime() <= tot)
    .sort((a, b) => b.d.getTime() - a.d.getTime() || a.r.categorie.localeCompare(b.r.categorie, 'nl'));

  const titel =
    vanaf === tot
      ? formatDag(new Date(tot), true)
      : `${formatDag(new Date(vanaf), false)} t/m ${formatDag(new Date(tot), true)}`;
  const plaatsen = [...new Set(gekozen.map((x) => x.r.plaats).filter(Boolean))];

  return { records: gekozen.map((x) => x.r), titel, plaatsen };
}

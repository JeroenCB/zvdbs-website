/*
 * Nieuws-import: Google Drive-map "Website" -> public/data/news.json
 *
 * Draait in een GitHub Action (zie .github/workflows/nieuws-import.yml), niet op Vercel.
 *
 * Werking (besluiten: zie CONTEXT.md, open punt 1):
 * - Elke submap van de Drive-map met "website-ready" in de naam is een artikel.
 *   Hoofdletters, spaties en streepjes maken niet uit.
 * - In zo'n submap staat precies één Google Doc; alleen die wordt gelezen.
 * - Bovenin de Doc: Titel:, Auteur:, Datum: (en optioneel Categorie:).
 * - Beveiliging A: een Doc wordt pas verwerkt als hij 30 minuten niet is aangepast.
 * - Beveiliging C: de import zet een opmerking in de Doc (geplaatst, bijgewerkt, fout,
 *   offline). Een mapnaam die bijna "website-ready" is, krijgt een waarschuwing.
 * - Wijzigingen in de Doc komen mee. Staat "website-ready" niet meer in de naam (of is de map
 *   weg), dan gaat het artikel offline.
 * - Artikelen uit Drive hebben een veld "bron" in news.json. Artikelen zonder "bron" (oude,
 *   handmatige) worden nooit aangeraakt, behalve via een koppeling in status.json.
 *
 * Omgevingsvariabelen:
 *   GOOGLE_NIEUWS_SA_KEY   JSON-sleutel van het service account (GitHub-secret)
 *   DRIVE_NIEUWS_MAP_ID    ID van de Drive-map "Website" (GitHub-secret)
 *   MODUS                  "proef" (standaard: niets schrijven, alleen tonen) of "echt"
 *   TOESTAAN_VEEL_VERWIJDEREN  "ja" om meer dan MAX_VERWIJDEREN artikelen tegelijk offline te halen
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { JWT } from 'google-auth-library';
import sharp from 'sharp';
import { leesDoc, maakHtml, maakSamenvatting, controleerMeta, slugify, esc, parseDatum } from './omzetten.mjs';

const ROOT = process.cwd();
const NEWS_PAD = path.join(ROOT, 'public/data/news.json');
const IMG_PAD = path.join(ROOT, 'public/images/news');
const STATUS_PAD = path.join(ROOT, 'scripts/nieuws-import/status.json');
const PROEF_PAD = path.join(ROOT, 'nieuws-proef');
const SITE = 'https://www.zvdbs.nl';
const RUST_MINUTEN = 30;
const MAX_VERWIJDEREN = 2;
const MARKER = 'websiteready';

const PROEF = (process.env.MODUS || 'proef').trim() !== 'echt';
const VEEL_VERWIJDEREN_OK = process.env.TOESTAAN_VEEL_VERWIJDEREN === 'ja';

const verslag = [];
const log = (regel) => {
  console.log(regel);
  verslag.push(regel);
};

// ---------- Google ----------

function maakClient() {
  const raw = process.env.GOOGLE_NIEUWS_SA_KEY;
  if (!raw) throw new Error('GOOGLE_NIEUWS_SA_KEY ontbreekt (GitHub-secret).');
  let sa;
  try {
    sa = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_NIEUWS_SA_KEY is geen geldige JSON. Plak de volledige inhoud van het sleutelbestand.');
  }
  return new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents.readonly'],
  });
}

function foutTekst(e) {
  return e?.response?.data?.error?.message || e?.message || String(e);
}

async function api(client, url, opties = {}) {
  const res = await client.request({ url, ...opties });
  return res.data;
}

async function lijst(client, q, velden) {
  const uit = [];
  let pageToken;
  do {
    const p = new URLSearchParams({
      q,
      fields: `nextPageToken, files(${velden})`,
      pageSize: '100',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    });
    if (pageToken) p.set('pageToken', pageToken);
    const d = await api(client, `https://www.googleapis.com/drive/v3/files?${p}`);
    uit.push(...(d.files || []));
    pageToken = d.nextPageToken;
  } while (pageToken);
  return uit;
}

const docsInMap = (client, mapId) =>
  lijst(client, `'${mapId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`, 'id, name, modifiedTime');

// ---------- Mapnamen ----------

function normNaam(n) {
  return n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}
const isKlaar = (naam) => normNaam(naam).includes(MARKER);

function afstand(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function lijktOpKlaar(naam) {
  const s = normNaam(naam);
  if (s.includes(MARKER)) return false;
  for (let len = MARKER.length - 2; len <= MARKER.length + 2; len++)
    for (let i = 0; i + len <= s.length; i++) if (afstand(s.slice(i, i + len), MARKER) <= 2) return true;
  return false;
}

// ---------- Bestanden ----------

let newsCrlf = false; // regeleinden van news.json (Windows \r\n of \n) behouden

async function leesNews() {
  const ruw = await fs.readFile(NEWS_PAD, 'utf-8');
  newsCrlf = ruw.includes('\r\n');
  const tekst = ruw.replace(/\r\n/g, '\n');
  const data = JSON.parse(tekst);
  // CONTEXT.md: news.json nooit herformatteren. We schrijven terug met exact dezelfde opmaak;
  // is het bestand anders opgemaakt, dan stoppen we liever dan alles te herschrijven.
  if (JSON.stringify(data, null, 2) !== tekst) {
    throw new Error('news.json heeft een afwijkende opmaak (niet JSON met 2 spaties). Import gestopt om het bestand niet te herformatteren.');
  }
  return data;
}

function newsTekst(news) {
  const t = JSON.stringify(news, null, 2);
  return newsCrlf ? t.replace(/\n/g, '\r\n') : t;
}

async function leesStatus() {
  try {
    const s = JSON.parse(await fs.readFile(STATUS_PAD, 'utf-8'));
    return { ...s, koppelingen: s.koppelingen || {}, meldingen: s.meldingen || {} };
  } catch {
    return { koppelingen: {}, meldingen: {} };
  }
}

async function verwerkAfbeelding(buf) {
  return sharp(buf, { failOn: 'none' })
    .rotate() // EXIF-rotatie toepassen; daarna gaat alle metadata (ook GPS) eruit
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

const hash = (x) => crypto.createHash('sha256').update(x).digest('hex').slice(0, 16);

// ---------- Opmerkingen in de Doc (beveiliging C) ----------

async function opmerking(client, status, docId, sleutel, tekst) {
  if (!docId) return;
  if (status.meldingen[docId] === sleutel) return; // deze melding is al eens geplaatst
  if (PROEF) {
    log(`  (proef) zou opmerking plaatsen: "${tekst}"`);
    return;
  }
  try {
    await api(client, `https://www.googleapis.com/drive/v3/files/${docId}/comments?fields=id&supportsAllDrives=true`, {
      method: 'POST',
      data: { content: `${tekst}\n\n(automatische melding van de website-import)` },
    });
    status.meldingen[docId] = sleutel;
  } catch (e) {
    log(`  ! opmerking plaatsen mislukt: ${foutTekst(e)}`);
  }
}

// ---------- Hoofdprogramma ----------

async function main() {
  log(`# Nieuws-import (${PROEF ? 'PROEF: er wordt niets opgeslagen' : 'ECHT'})`);
  const mapId = (process.env.DRIVE_NIEUWS_MAP_ID || '').trim();
  if (!mapId) throw new Error('DRIVE_NIEUWS_MAP_ID ontbreekt (GitHub-secret).');

  const client = maakClient();

  // Veiligheid: eerst controleren dat de hoofdmap echt bereikbaar is. Anders zou een
  // ingetrokken deelrecht eruitzien als "geen artikelen meer" en alles offline halen.
  try {
    const m = await api(client, `https://www.googleapis.com/drive/v3/files/${mapId}?fields=id,name,mimeType&supportsAllDrives=true`);
    if (m.mimeType !== 'application/vnd.google-apps.folder') throw new Error('Het ID is geen map.');
    log(`Drive-map: "${m.name}"`);
  } catch (e) {
    throw new Error(`Drive-map niet bereikbaar: ${foutTekst(e)}. Is de map gedeeld met het service account?`);
  }

  const news = await leesNews();
  const status = await leesStatus();
  const mappen = await lijst(client, `'${mapId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`, 'id, name');
  const klaar = mappen.filter((m) => isKlaar(m.name));
  const klaarIds = new Set(klaar.map((m) => m.id));
  log(`${mappen.length} submappen gevonden, waarvan ${klaar.length} website-ready.\n`);

  let gewijzigd = false;
  const uitvoer = []; // voor de proef-voorbeeldpagina

  // 1. Bijna-goede mapnamen: waarschuwen
  for (const m of mappen.filter((x) => lijktOpKlaar(x.name))) {
    log(`- "${m.name}": lijkt op website-ready maar is het niet precies.`);
    const docs = await docsInMap(client, m.id);
    if (docs.length === 1) {
      await opmerking(client, status, docs[0].id, `bijna:${m.name}`,
        `De mapnaam "${m.name}" lijkt op "website-ready", maar is het niet precies. Bedoel je "website-ready"? Pas dan de mapnaam aan; het artikel wordt de volgende keer geplaatst.`);
    }
  }

  // 2. Website-ready mappen verwerken
  for (const map of klaar) {
    log(`- "${map.name}" (map-ID ${map.id})`);
    const docs = await docsInMap(client, map.id);
    if (docs.length !== 1) {
      const reden = docs.length === 0 ? 'er staat geen Google Doc in de map' : `er staan ${docs.length} Google Docs in de map (het moet er precies één zijn)`;
      log(`  overgeslagen: ${reden}`);
      for (const d of docs) await opmerking(client, status, d.id, `fout:${reden}`, `Niet op de website geplaatst: ${reden}.`);
      continue;
    }
    const doc = docs[0];

    let artikel = news.find((a) => a.bron?.map === map.id);
    const koppelId = status.koppelingen[map.id];
    if (!artikel && koppelId !== undefined) {
      artikel = news.find((a) => String(a.id) === String(koppelId) && !a.bron);
      if (artikel) log(`  gekoppeld aan bestaand artikel ${artikel.id} ("${artikel.title}")`);
    }
    if (!artikel && koppelId !== 'nieuw') {
      // Veiligheid tegen dubbele artikelen: staat er een datum in de mapnaam en bestaat er al
      // een handmatig artikel op die datum, dan eerst laten bevestigen (koppelen of "nieuw").
      const m = map.name.match(/(\d{1,2}[-/.]\d{1,2}[-/.](?:\d{4}|\d{2}))/);
      const dag = m && parseDatum(m[1])?.slice(0, 10);
      const kandidaat = dag && news.find((a) => !a.bron && String(a.date).startsWith(dag));
      if (kandidaat) {
        log(`  overgeslagen: er bestaat al een artikel van ${dag}: ${kandidaat.id} ("${kandidaat.title}").`);
        log(`    Zelfde artikel? Zet in scripts/nieuws-import/status.json bij "koppelingen": "${map.id}": ${kandidaat.id}`);
        log(`    Ander artikel? Zet daar: "${map.id}": "nieuw"`);
        continue;
      }
    }

    if (artikel?.bron && artikel.bron.doc === doc.id && artikel.bron.gewijzigd === doc.modifiedTime) {
      log('  ongewijzigd');
      continue;
    }
    const minutenGeleden = (Date.now() - Date.parse(doc.modifiedTime)) / 60000;
    if (minutenGeleden < RUST_MINUTEN) {
      log(`  wacht: de Doc is ${Math.floor(minutenGeleden)} min geleden aangepast (minimaal ${RUST_MINUTEN} min rust)`);
      continue;
    }

    let resultaat;
    try {
      let gdoc;
      try {
        gdoc = await api(client, `https://docs.googleapis.com/v1/documents/${doc.id}`);
      } catch (e) {
        const t = foutTekst(e);
        if (/has not been used|is disabled/i.test(t)) throw Object.assign(new Error(`Google Docs API staat uit in het Cloud-project: ${t}`), { fataal: true });
        throw new Error(`Doc niet te lezen: ${t}`);
      }
      const gelezen = leesDoc(gdoc);
      const meta = controleerMeta(gelezen.meta);

      const fotos = [];
      for (const a of gelezen.afbeeldingen) {
        const r = await fetch(a.uri);
        if (!r.ok) throw new Error(`foto downloaden mislukt (${r.status})`);
        fotos.push(await verwerkAfbeelding(Buffer.from(await r.arrayBuffer())));
      }

      const slug = artikel?.slug || uniekeSlug(news, slugify(meta.titel) || `artikel-${map.id.slice(0, 8)}`);
      const content = maakHtml(gelezen.nodes, slug, gelezen.afbeeldingen, meta.titel);
      const inhoudHash = hash(JSON.stringify([meta, content, fotos.map((f) => hash(f))]));
      resultaat = { meta, slug, content, fotos, inhoudHash, excerpt: maakSamenvatting(gelezen.nodes), waarschuwingen: gelezen.waarschuwingen };
    } catch (e) {
      if (e.fataal) throw e;
      log(`  FOUT: ${e.message}`);
      await opmerking(client, status, doc.id, `fout:${e.message}`,
        `Niet op de website geplaatst: ${e.message}. Pas de Doc aan; de import probeert het de volgende keer opnieuw.`);
      continue;
    }

    for (const w of resultaat.waarschuwingen) log(`  waarschuwing: ${w}`);

    if (artikel?.bron && artikel.bron.hash === resultaat.inhoudHash) {
      log('  inhoud gelijk gebleven');
      artikel.bron.gewijzigd = doc.modifiedTime;
      gewijzigd = true;
      continue;
    }

    const nieuw = !artikel;
    const record = {
      id: artikel ? artikel.id : Math.max(0, ...news.map((a) => Number(a.id) || 0)) + 1,
      title: resultaat.meta.titel,
      slug: resultaat.slug,
      content: resultaat.content,
      excerpt: resultaat.excerpt,
      author: resultaat.meta.auteur,
      date: resultaat.meta.datum,
      category: resultaat.meta.categorie,
      bron: { map: map.id, doc: doc.id, gewijzigd: doc.modifiedTime, hash: resultaat.inhoudHash },
    };
    if (artikel) news[news.indexOf(artikel)] = record;
    else news.push(record);
    gewijzigd = true;

    await schrijfFotos(resultaat.slug, resultaat.fotos);
    uitvoer.push(record);
    log(`  ${nieuw ? 'NIEUW' : 'BIJGEWERKT'}: "${record.title}" -> ${SITE}/news/${record.slug} (${resultaat.fotos.length} foto's)`);
    await opmerking(client, status, doc.id, `online:${resultaat.inhoudHash}`,
      `${nieuw ? 'Dit artikel staat op de website' : 'Het artikel op de website is bijgewerkt'}: ${SITE}/news/${record.slug}\nHet kan na de import nog een paar minuten duren voordat het zichtbaar is.`);
  }

  // 3. Artikelen uit Drive waarvan de map niet meer website-ready is: offline halen
  const weg = news.filter((a) => a.bron && !klaarIds.has(a.bron.map));
  if (weg.length > MAX_VERWIJDEREN && !VEEL_VERWIJDEREN_OK) {
    throw new Error(`${weg.length} artikelen zouden offline gaan (${weg.map((a) => a.title).join(', ')}). Dat is meer dan ${MAX_VERWIJDEREN} tegelijk; als dat klopt, start de import handmatig met "veel verwijderen toestaan".`);
  }
  for (const a of weg) {
    log(`- OFFLINE: "${a.title}" ("website-ready" staat niet meer in de mapnaam, of de map is weg)`);
    news.splice(news.indexOf(a), 1);
    gewijzigd = true;
    if (!PROEF) await fs.rm(path.join(IMG_PAD, a.slug), { recursive: true, force: true });
    await opmerking(client, status, a.bron.doc, `offline:${a.bron.hash}`,
      'Dit artikel is van de website gehaald, omdat "website-ready" niet meer in de mapnaam staat.');
  }

  // 4. Opslaan
  news.sort((a, b) => Date.parse(b.date.replace(' ', 'T')) - Date.parse(a.date.replace(' ', 'T')));
  if (PROEF) {
    await schrijfProefVoorbeeld(uitvoer);
    log(`\nProef klaar. ${gewijzigd ? 'Er zouden wijzigingen zijn.' : 'Geen wijzigingen.'} Download "nieuws-proef" onderaan deze run om het resultaat te bekijken.`);
  } else {
    if (gewijzigd) await fs.writeFile(NEWS_PAD, newsTekst(news));
    await fs.writeFile(STATUS_PAD, `${JSON.stringify(status, null, 2)}\n`);
    log(`\nKlaar. ${gewijzigd ? 'news.json is bijgewerkt.' : 'Geen wijzigingen.'}`);
  }
}

function uniekeSlug(news, basis) {
  let slug = basis;
  for (let i = 2; news.some((a) => a.slug === slug); i++) slug = `${basis}-${i}`;
  return slug;
}

async function schrijfFotos(slug, fotos) {
  const dir = PROEF ? path.join(PROEF_PAD, 'images/news', slug) : path.join(IMG_PAD, slug);
  await fs.rm(dir, { recursive: true, force: true });
  if (!fotos.length) return;
  await fs.mkdir(dir, { recursive: true });
  for (let i = 0; i < fotos.length; i++) await fs.writeFile(path.join(dir, `${i + 1}.jpg`), fotos[i]);
}

async function schrijfProefVoorbeeld(artikelen) {
  await fs.mkdir(PROEF_PAD, { recursive: true });
  const blokken = artikelen
    .map((a) => `<article><p class="meta">${esc(a.date)} · ${esc(a.author)} · ${esc(a.category)} · /news/${esc(a.slug)}</p><h1>${esc(a.title)}</h1><p class="excerpt">${esc(a.excerpt)}</p><div class="artikel">${a.content.replace(/src="\/images\//g, 'src="images/')}</div></article>`)
    .join('<hr>');
  const html = `<!doctype html><html lang="nl"><meta charset="utf-8"><title>Proef nieuws-import</title><style>body{font-family:system-ui,sans-serif;max-width:42rem;margin:2rem auto;padding:0 1rem;line-height:1.7}img{max-width:100%;height:auto;border-radius:1rem}.meta,.excerpt{color:#5b6b7c;font-size:.9rem}.aspect-video{aspect-ratio:16/9}iframe{width:100%;height:100%}</style><body>${blokken || '<p>Geen nieuwe of gewijzigde artikelen.</p>'}</body></html>`;
  await fs.writeFile(path.join(PROEF_PAD, 'voorbeeld.html'), html);
  await fs.writeFile(path.join(PROEF_PAD, 'artikelen.json'), JSON.stringify(artikelen, null, 2));
}

try {
  await main();
} catch (e) {
  log(`\nGESTOPT: ${e.message}`);
  process.exitCode = 1;
} finally {
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `\`\`\`\n${verslag.join('\n')}\n\`\`\`\n`);
}

/*
 * Zet een Google Doc (zoals de Google Docs API hem teruggeeft) om naar een nieuwsartikel.
 * Geen externe afhankelijkheden, zodat dit los te testen is.
 *
 * Veiligheid: de HTML wordt hier zelf opgebouwd uit de structuur van de Doc, en alle tekst
 * wordt ge-escaped. Er komt dus nooit HTML of script uit de Doc zelf op de website.
 * Links: alleen http(s) en mailto. Video's: alleen YouTube, op basis van een geldig video-ID.
 */

export const CATEGORIEEN = ['nieuws', 'competitie', 'update', 'aankondiging'];

const MAANDEN = {
  jan: 1, januari: 1, feb: 2, februari: 2, mrt: 3, maart: 3, apr: 4, april: 4, mei: 5,
  jun: 6, juni: 6, jul: 7, juli: 7, aug: 8, augustus: 8, sep: 9, sept: 9, september: 9,
  okt: 10, oktober: 10, nov: 11, november: 11, dec: 12, december: 12,
};

export function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function escAttr(t) {
  return esc(t).replace(/"/g, '&quot;');
}

export function veiligeUrl(url) {
  return typeof url === 'string' && /^(https?:\/\/|mailto:)/i.test(url.trim());
}

export function youtubeId(url) {
  if (typeof url !== 'string') return null;
  const m = url
    .trim()
    .match(/^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#].*)?$/);
  return m ? m[1] : null;
}

export function slugify(t) {
  return String(t)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/-+$/g, '');
}

/** "3-10-2026", "03/10/2026", "2026-10-03", "3 oktober 2026" -> "2026-10-03 12:00:00" of null */
export function parseDatum(t) {
  const s = String(t).trim().toLowerCase();
  let d, m, j;
  let r;
  if ((r = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) [, j, m, d] = r;
  else if ((r = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/))) [, d, m, j] = r;
  else if ((r = s.match(/^(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})$/)) && MAANDEN[r[2]]) {
    d = r[1];
    m = MAANDEN[r[2]];
    j = r[3];
  } else return null;
  d = Number(d);
  m = Number(m);
  j = Number(j);
  if (j < 100) j += 2000;
  const dt = new Date(Date.UTC(j, m - 1, d));
  if (dt.getUTCFullYear() !== j || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${j}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} 12:00:00`;
}

const META = /^\s*(titel|title|auteur|schrijver|datum|date|categorie)\s*[:：]\s*(.*)$/i;
const META_SLEUTEL = { titel: 'titel', title: 'titel', auteur: 'auteur', schrijver: 'auteur', datum: 'datum', date: 'datum', categorie: 'categorie' };

/** Placeholder voor een afbeelding; wordt na het kiezen van de slug vervangen door een <img>. */
const IMG = (n) => `\u0000IMG${n}\u0000`;

function embeddedObject(doc, id, positioned) {
  const bron = positioned ? doc.positionedObjects?.[id]?.positionedObjectProperties : doc.inlineObjects?.[id]?.inlineObjectProperties;
  return bron?.embeddedObject || null;
}

/**
 * Stap 1: Doc -> tussenvorm.
 * Geeft { meta, nodes, afbeeldingen: [{uri, alt}], waarschuwingen }.
 */
export function leesDoc(doc) {
  const afbeeldingen = [];
  const waarschuwingen = [];

  const afbeelding = (id, positioned) => {
    const eo = embeddedObject(doc, id, positioned);
    const uri = eo?.imageProperties?.contentUri;
    if (!uri) {
      waarschuwingen.push('Een element (bijv. tekening of grafiek) is geen foto en is overgeslagen.');
      return '';
    }
    afbeeldingen.push({ uri, alt: (eo.description || eo.title || '').trim() });
    return IMG(afbeeldingen.length);
  };

  const runs = (elements) => {
    let html = '';
    let tekst = '';
    let linkTekst = '';
    const links = [];
    let aantalImg = 0;
    for (const el of elements || []) {
      if (el.textRun) {
        const t = (el.textRun.content || '').replace(/\n$/, '');
        if (!t) continue;
        const st = el.textRun.textStyle || {};
        tekst += t;
        let h = esc(t).replace(/\u000b/g, '<br>');
        if (st.bold) h = `<strong>${h}</strong>`;
        if (st.italic) h = `<em>${h}</em>`;
        const url = st.link?.url;
        if (url) {
          links.push(url);
          linkTekst += t;
          if (veiligeUrl(url)) h = `<a href="${escAttr(url.trim())}">${h}</a>`;
        }
        html += h;
      } else if (el.richLink) {
        const p = el.richLink.richLinkProperties || {};
        const label = p.title || p.uri || '';
        tekst += label;
        linkTekst += label;
        if (p.uri) links.push(p.uri);
        html += veiligeUrl(p.uri) ? `<a href="${escAttr(p.uri.trim())}">${esc(label)}</a>` : esc(label);
      } else if (el.inlineObjectElement) {
        const ph = afbeelding(el.inlineObjectElement.inlineObjectId, false);
        if (ph) aantalImg++;
        html += ph;
      }
    }
    return { html, tekst, linkTekst, links, aantalImg };
  };

  const nodes = [];

  const verwerkParagraaf = (p) => {
    const r = runs(p.elements);
    const naStukken = (p.positionedObjectIds || []).map((id) => afbeelding(id, true)).filter(Boolean);
    const stijl = p.paragraphStyle?.namedStyleType || 'NORMAL_TEXT';
    const kaal = r.tekst.replace(/[\s\u000b]+/g, ' ').trim();

    // YouTube-link op een eigen regel -> video
    const yt = youtubeId(kaal) || (r.links.length === 1 && youtubeId(r.links[0]) && kaal.length <= r.linkTekst.trim().length ? youtubeId(r.links[0]) : null);
    if (yt && r.aantalImg === 0) {
      nodes.push({ type: 'yt', id: yt, tekst: kaal });
    } else if (p.bullet) {
      const lvl = p.bullet.nestingLevel || 0;
      const nl = doc.lists?.[p.bullet.listId]?.listProperties?.nestingLevels?.[lvl] || {};
      const geordend = !!nl.glyphType && nl.glyphType !== 'GLYPH_TYPE_UNSPECIFIED' && !nl.glyphSymbol;
      if (r.html.trim()) nodes.push({ type: 'li', niveau: lvl, geordend, html: r.html, tekst: kaal });
    } else if (!kaal && r.aantalImg > 0) {
      nodes.push({ type: 'fig', html: r.html, tekst: '' });
    } else if (kaal || r.aantalImg > 0) {
      let type = 'p';
      if (['TITLE', 'HEADING_1', 'HEADING_2'].includes(stijl)) type = 'h2';
      else if (stijl.startsWith('HEADING_') || stijl === 'SUBTITLE') type = 'h3';
      nodes.push({ type, html: r.html, tekst: kaal });
    }
    for (const ph of naStukken) nodes.push({ type: 'fig', html: ph, tekst: '' });
  };

  for (const se of doc.body?.content || []) {
    if (se.paragraph) verwerkParagraaf(se.paragraph);
    else if (se.table) {
      waarschuwingen.push('Een tabel is omgezet naar losse regels (tabellen worden niet als tabel overgenomen).');
      for (const rij of se.table.tableRows || []) {
        const cellen = (rij.tableCells || []).map((c) =>
          (c.content || [])
            .filter((x) => x.paragraph)
            .map((x) => runs(x.paragraph.elements))
            .map((r) => r.html.trim())
            .filter(Boolean)
            .join(' '),
        );
        const html = cellen.filter(Boolean).join(' · ');
        if (html) nodes.push({ type: 'p', html, tekst: html });
      }
    }
  }

  // Vaste regels bovenin (Titel:, Auteur:, Datum:, Categorie:) uitlezen en uit de tekst halen.
  const meta = {};
  while (nodes.length) {
    const n = nodes[0];
    const m = n.type !== 'fig' && n.type !== 'yt' ? n.tekst.match(META) : null;
    if (!m) break;
    meta[META_SLEUTEL[m[1].toLowerCase()]] = m[2].trim();
    nodes.shift();
  }

  return { meta, nodes, afbeeldingen, waarschuwingen };
}

/** Stap 2: tussenvorm -> HTML (met afbeeldingspaden voor deze slug). */
export function maakHtml(nodes, slug, afbeeldingen, titel) {
  let out = '';
  const open = [];
  const sluitLijsten = () => {
    while (open.length) out += `</li></${open.pop()}>`;
  };
  for (const n of nodes) {
    if (n.type === 'li') {
      const tag = n.geordend ? 'ol' : 'ul';
      if (open.length === 0 || n.niveau > open.length - 1) {
        while (open.length <= n.niveau) {
          out += `<${tag}>`;
          open.push(tag);
        }
      } else {
        while (open.length - 1 > n.niveau) out += `</li></${open.pop()}>`;
        out += '</li>';
      }
      out += `<li>${n.html}`;
      continue;
    }
    sluitLijsten();
    if (n.type === 'yt') {
      out += `\n<div class="aspect-video max-w-2xl my-6"><iframe class="w-full h-full rounded-xl" src="https://www.youtube-nocookie.com/embed/${n.id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>\n`;
    } else if (n.type === 'fig') {
      out += n.html
        .split('\u0000')
        .filter((x) => x.startsWith('IMG'))
        .map((x) => `<figure>\u0000${x}\u0000</figure>`)
        .join('');
    } else {
      out += `<${n.type}>${n.html}</${n.type}>`;
    }
  }
  sluitLijsten();
  return out
    .replace(/\u0000IMG(\d+)\u0000/g, (_, i) => {
      const a = afbeeldingen[Number(i) - 1];
      return `<img src="/images/news/${slug}/${i}.jpg" alt="${escAttr(a?.alt || titel)}" loading="lazy">`;
    })
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export function maakSamenvatting(nodes) {
  const eerste = nodes.find((n) => n.type === 'p' && n.tekst);
  if (!eerste) return '';
  const t = eerste.tekst.replace(/\s+/g, ' ').trim();
  if (t.length <= 200) return t;
  const kort = t.slice(0, 198);
  const spatie = kort.lastIndexOf(' ');
  return `${(spatie > 120 ? kort.slice(0, spatie) : kort).replace(/[\s,.;:]+$/, '')}…`;
}

/** Controleert de vaste regels en geeft {titel, auteur, datum, categorie} of gooit een fout met uitleg. */
export function controleerMeta(meta) {
  const fouten = [];
  if (!meta.titel) fouten.push('de regel "Titel: ..." ontbreekt bovenin');
  let datum = null;
  if (!meta.datum) fouten.push('de regel "Datum: ..." ontbreekt bovenin');
  else if (!(datum = parseDatum(meta.datum))) fouten.push(`de datum "${meta.datum}" is niet te lezen (gebruik bijv. 3-10-2026)`);
  let categorie = (meta.categorie || 'nieuws').toLowerCase();
  if (!CATEGORIEEN.includes(categorie)) fouten.push(`categorie "${meta.categorie}" bestaat niet (kies uit: ${CATEGORIEEN.join(', ')})`);
  if (fouten.length) throw new Error(fouten.join('; '));
  return { titel: meta.titel, auteur: meta.auteur || 'ZVDBS', datum, categorie };
}

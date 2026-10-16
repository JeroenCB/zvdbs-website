# Context: website Zwemvereniging de Blauwe Schuur (ZVDBS)

Lees dit bestand aan het begin van een nieuwe taak. Houd het bij als er iets verandert.

## Voorkeuren van Jeroen
- Altijd in het Nederlands. Kort, direct en kritisch. Vraag bij twijfel eerst.
- Geen terminal-expert: geef git-commando's stap voor stap (Windows, PowerShell/cmd).
- Geheimen (API-keys, wachtwoorden) nooit in de chat of in de repo.

## Techniek
- Next.js 14 + TypeScript + Tailwind. Repo: github.com/JeroenCB/zvdbs-website.
- Vercel deployt automatisch bij elke push naar main.
- Lokale mappen: pc thuis `D:\zvdbs-website`, laptop `C:\zvdbs-website\zvdbs-website`.
- Werkwijze: Claude past bestanden aan, Jeroen doet zelf `git pull`, `git add -A`,
  `git commit -m "..."`, `git push`. Begin altijd met `git pull` (twee computers).
- Domein zvdbs.nl: DNS bij VDX. Mail via de VDX-server (MX = `mail.zvdbs.nl.`).

## Inhoud
- `public/data/pages.json` en `news.json` bevatten HTML in JSON. Bewerk met gerichte
  tekstvervanging; nooit het hele bestand opnieuw wegschrijven of herformatteren.
- Nieuwsartikel = `{id, title, slug, content, excerpt, author, date, category}`,
  nieuwste bovenaan. Foto's in `public/images/news`, oude WordPress-foto's in
  `public/images/wp`, PDF's in `public/documents`. Filmpjes: YouTube-embed met
  `<div class="aspect-video max-w-2xl my-6"><iframe ...>`.
- Clubrecords komen live uit een Google Sheet via `/api/records` (tabbladen
  Vlinderslag, Rugcrawl, Schoolslag, Borstcrawl, Wisselslag). Datums zijn tekst (dd/mm/jjjj).
- Komende activiteiten (30 dagen) op de homepage komen uit de openbare Google-agenda
  "DBS activiteiten" (eigenaar: activiteitencommissie) via `/api/activiteiten`, met
  hetzelfde service account. Vereist dat de Google Calendar API aan staat.
- Formulieren (contact, proefzwemmen, lidmaatschap) sturen mail via Brevo.
- Omgevingsvariabelen staan in Vercel (namen in `.env.example`), niet in de repo.

## Gedaan
- Mailprobleem opgelost (MX-record).
- Alle kapotte oude WordPress-links en -foto's gerepareerd (119 foto's + 2 PDF's lokaal).
- "Nieuwste clubrecords" toegevoegd op de Clubrecords-tab en de homepage
  (`src/lib/laatsteWedstrijd.ts`: datums max. 3 dagen uit elkaar = één wedstrijd).
- Verslag Landelijke A Competitie deel 1 (3 oktober 2026) geplaatst.
- Laptop-opzet getest: clone, `npm install`, `npm run dev`, push en deploy werken.

## Open punten
1. Spam op formulieren: Cloudflare Turnstile plus servercontrole in de 3 API-routes
   (code nog niet geschreven; eerst site-key en secret in Vercel zetten, dan pas pushen).
   Daarnaast een Vercel Firewall-regel: formulier-API's blokkeren buiten Nederland,
   eerst op "Log" om te zien waar de spam vandaan komt.
2. `/api/news` en `/admin/news` hebben geen inlog en werken niet op Vercel
   (geen schrijfrechten): verwijderen of beveiligen.
3. Nieuws plaatsen zonder Claude: opties zijn Google Docs-import, Sanity-redactietool
   of een eigen beheerscherm. Jeroen bespreekt dit eerst met de rest.
4. Sheet-fouten: 4x50 wisselslag MJO16 (03/10/2026) heeft plaats Veenendaal (moet
   Driebergen zijn); 200 vrij MO18 heeft datum "10.40,11".
5. Pagina's `nieuwsoverzicht` en `nieuwsarchief` zijn WordPress-restanten: verwijderen?
6. Foto's in het nieuwste artikel zijn klein (586 px): originelen vervangen.
7. AVG: toestemming voor foto's en filmpjes van kinderen controleren.
8. Opruimen door Jeroen: map `_media-import`, zips in Downloads, 21 bestanden
   `zvdbs-media-*.zip` op de Plesk-server.
9. Testen of Claude op de laptop in de repo kan werken (nieuwe taak, laptop, binnenste map).

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
- Domein zvdbs.nl: DNS en webhosting (Webhosting XS) bij VDX, beheer via mijn.vdx.nl.
  Mail van @zvdbs.nl loopt via de VDX-server. De antispamdienst PASS staat uit (betaald, € 2,50 p.m.).

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
- Formulieren (contact, proefzwemmen, lidmaatschap) sturen mail via SMTP van VDX met de
  mailbox `website@zvdbs.nl` (`src/lib/mail.ts`, `src/lib/smtp.ts`). Brevo
  (`src/lib/brevo.ts`) is alleen de terugval als SMTP niet is ingesteld of mislukt.
  Ontvangers: `CONTACT_TO_EMAIL` en `MEMBERSHIP_TO_EMAIL` (standaard secretaris@zvdbs.nl).
- Spambeveiliging op de 3 formulieren (`src/lib/antispam.ts`, `src/components/forms/AntispamVelden.tsx`):
  honeypot-veld `hp_website`, minimale invultijd 2 s (`startedAt`) en Cloudflare Turnstile
  (token server-side gecontroleerd; zonder `TURNSTILE_SECRET_KEY` weigert de server in productie).
- Omgevingsvariabelen staan in Vercel (namen in `.env.example`), niet in de repo:
  Google (GOOGLE_*), Brevo (BREVO_*), SMTP (SMTP_HOST/PORT/USER/PASSWORD),
  Turnstile (NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY), CONTACT_TO_EMAIL,
  MEMBERSHIP_TO_EMAIL. Na wijzigen van een variabele is een nieuwe deploy nodig.

## Gedaan
- Alle kapotte oude WordPress-links en -foto's gerepareerd (119 foto's + 2 PDF's lokaal).
- "Nieuwste clubrecords" toegevoegd op de Clubrecords-tab en de homepage
  (`src/lib/laatsteWedstrijd.ts`: datums max. 3 dagen uit elkaar = één wedstrijd).
- Verslag Landelijke A Competitie deel 1 (3 oktober 2026) geplaatst.
- Laptop-opzet getest: clone, `npm install`, `npm run dev`, push en deploy werken.
- Komende activiteiten uit Google Agenda werken (Calendar API aangezet).
- Spambeveiliging formulieren: honeypot, invultijd en Turnstile live (okt 2026).
- Mailincident 15-20 okt 2026: Brevo's gedeelde IP stond op de SpamCop-blocklist en de
  VDX-mailserver weigerde Brevo-mail (soft bounces, VDX zet de blocklist niet uit).
  Opgelost door formulier-mail via SMTP van VDX te sturen (`website@zvdbs.nl`).
  Gemiste inzendingen in die periode: 1 echte aanmelding, handmatig doorgestuurd.

## Open punten
1. `/api/news` en `/admin/news` (geen inlog, werken niet op Vercel) gaan offline door ze
   naar `src/app/_offline/` te verplaatsen (Next negeert mappen met een underscore).
   De bestanden blijven bewaard. Daarna: nieuws plaatsen zonder Claude via een
   Google Docs-import bouwen (Jeroen wil dit eerst proberen; andere opties: Sanity of
   een eigen beheerscherm).
2. Optionele Vercel Firewall-regel: formulier-API's blokkeren buiten Nederland, eerst
   op "Log". Nu minder nodig, want Turnstile en honeypot draaien al. Nadeel: Nederlanders
   in het buitenland of met VPN kunnen niets versturen.
3. Brevo blijft de terugval voor formulier-mail. Besluit: laten staan of uitzetten?
   Zo laten, dan staat Brevo niet in de SPF-record van zvdbs.nl. Houd de Vercel-runtime-logs
   in de gaten op "versturen via SMTP mislukt".
4. Spam in de mailbox zelf (okt 2026: elke 15 min campagnes): overweeg PASS (€ 2,50 p.m.)
   of het spamfilter in het VDX-paneel. Besluit voor het bestuur.
5. AVG/privacy: `app@zvdbs.nl` stuurt door naar een privé-Gmail van Jeroen; controleer
   bij `secretaris@zvdbs.nl` onder Doorsturen of er geen extern adres staat. Het
   wachtwoord van `website@zvdbs.nl` alleen in Vercel bewaren.
6. AVG: toestemming voor foto's en filmpjes van kinderen controleren.
7. Sheet-fouten: 4x50 wisselslag MJO16 (03/10/2026) heeft plaats Veenendaal (moet
   Driebergen zijn); 200 vrij MO18 heeft datum "10.40,11".
8. Pagina's `nieuwsoverzicht` en `nieuwsarchief` zijn WordPress-restanten: verwijderen?
9. Foto's in het nieuwste artikel zijn klein (586 px): originelen vervangen.
10. Opruimen door Jeroen: map `_media-import`, zips in Downloads, 21 bestanden
    `zvdbs-media-*.zip` op de VDX-server.
11. Testen of Claude op de laptop in de repo kan werken (nieuwe taak, laptop, binnenste map).

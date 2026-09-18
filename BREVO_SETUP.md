# Brevo instellen voor de formulieren

De website gebruikt [Brevo](https://www.brevo.com) (Europees, gratis tot 300 e-mails per dag)
om e-mails te versturen vanuit het contactformulier, het proefzwem-aanmeldformulier en het
lidmaatschap-aanmeldformulier. Zonder deze instellingen werken de formulieren niet.

Dit hoef je maar één keer te doen.

## Stap 1: Account aanmaken

1. Ga naar https://www.brevo.com en klik op **Sign up free**.
2. Maak een account aan met het e-mailadres van de vereniging (bijvoorbeeld secretaris@zvdbs.nl).
3. Doorloop de korte setup-vragen (bedrijfsnaam: "Zwemvereniging de Blauwe Schuur" is prima).

Er wordt geen creditcard gevraagd voor het gratis plan.

## Stap 2: Afzender-e-mailadres verifiëren

Brevo staat alleen toe dat je e-mail verstuurt vanaf een adres dat je hebt geverifieerd.

1. Ga in het Brevo dashboard naar **Settings** (tandwiel-icoon rechtsboven) → **Senders, Domains & Dedicated IPs**.
2. Klik op **Add a sender**.
3. Vul in:
   - **Naam**: bijvoorbeeld "ZVDBS website"
   - **E-mailadres**: het adres waarvan de formulieren "verzonden" lijken te worden, bijvoorbeeld `noreply@zvdbs.nl` of gewoon `secretaris@zvdbs.nl` als je geen apart adres wilt aanmaken.
4. Brevo stuurt een verificatiemail naar dat adres. Open die mail en klik op de bevestigingslink.

Let op: dit hoeft geen adres te zijn waar je zelf op reageert — het is alleen het "van"-adres.
De antwoorden van bezoekers komen sowieso altijd binnen op **secretaris@zvdbs.nl** (of het adres
dat je in stap 4 instelt), omdat het formulier dat adres als "reply-to" meestuurt.

## Stap 3: API-key aanmaken

1. Ga naar **Settings** → **SMTP & API** (of zoek naar "API Keys" in het menu).
2. Klik op het tabblad **API Keys**.
3. Klik op **Generate a new API key**.
4. Geef hem een naam, bijvoorbeeld "ZVDBS website".
5. Kopieer de key direct — deze wordt maar één keer getoond. Bewaar hem tijdelijk ergens veilig
   (bijvoorbeeld een wachtwoordkluis), je hebt hem in de volgende stap nodig.

## Stap 4: Environment variables toevoegen in Vercel

1. Ga naar https://vercel.com/dashboard en open het project **zvdbs-website**.
2. Ga naar **Settings** → **Environment Variables**.
3. Voeg de volgende variabelen toe (voor alle omgevingen: Production, Preview en Development):

   | Naam | Waarde |
   |------|--------|
   | `BREVO_API_KEY` | de key uit stap 3 |
   | `BREVO_SENDER_EMAIL` | het geverifieerde adres uit stap 2 |
   | `BREVO_SENDER_NAME` | bijvoorbeeld `ZVDBS website` |
   | `CONTACT_TO_EMAIL` | `secretaris@zvdbs.nl` (of een ander adres als je dat liever hebt) |
   | `MEMBERSHIP_TO_EMAIL` | `secretaris@zvdbs.nl` (mag hetzelfde adres zijn) |

4. Klik steeds op **Save**.
5. Ga naar het tabblad **Deployments**, open de nieuwste deployment en klik op **Redeploy**
   (rechtsboven, drie puntjes → Redeploy). Environment variables worden pas actief na een nieuwe
   deployment.

## Stap 5: Testen

1. Ga naar de live website → **Contact** → vul het formulier in en verstuur het.
2. Controleer of de e-mail binnenkomt op het adres dat je bij `CONTACT_TO_EMAIL` hebt ingevuld
   (kijk ook in de spamfolder bij de eerste test).
3. Herhaal dit voor **Lidmaatschap** (onderaan de pagina) en **Proefzwemmen**.

Lukt het versturen niet? Kijk in Vercel onder **Deployments** → de betreffende deployment →
**Functions** / **Logs** naar de foutmelding. De meest voorkomende oorzaken zijn:

- `BREVO_API_KEY ontbreekt` → de environment variable staat niet (goed) in Vercel, of er is niet
  opnieuw gedeployed na het toevoegen.
- Brevo geeft een 401-foutmelding → de API-key is verkeerd gekopieerd.
- Brevo geeft een foutmelding over de afzender → het `BREVO_SENDER_EMAIL`-adres is nog niet
  geverifieerd (stap 2).

## Gratis limiet

Het gratis plan van Brevo staat 300 e-mails per dag toe. Voor de formulieren van deze website
(contact, proefzwemmen, lidmaatschap) is dat ruim voldoende — dat zou alleen een probleem worden
bij meer dan 300 aanmeldingen/berichten op één dag.

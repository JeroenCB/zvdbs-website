'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type VoorWie = 'zelf' | 'minderjarige' | '';

const radioLabel = 'flex items-start gap-2 text-sm text-ink dark:text-night-ink';
const fieldLabel = 'block text-sm font-medium text-ink mb-2 dark:text-night-ink';
const textInput =
  'w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan';

export default function LidmaatschapForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [voorWie, setVoorWie] = useState<VoorWie>('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      voorWie: formData.get('voorWie')?.toString() ?? '',
      naam: formData.get('naam')?.toString() ?? '',
      geslacht: formData.get('geslacht')?.toString() ?? '',
      geboortedatum: formData.get('geboortedatum')?.toString() ?? '',
      adres: formData.get('adres')?.toString() ?? '',
      postcodeWoonplaats: formData.get('postcodeWoonplaats')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      telefoon: formData.get('telefoon')?.toString() ?? '',
      trainingenPerWeek: formData.get('trainingenPerWeek')?.toString() ?? '',
      opmerkingen: formData.get('opmerkingen')?.toString() ?? '',
      akkoordLidwording: formData.get('akkoordLidwording') === 'on',
      toestemmingFotos: formData.get('toestemmingFotos')?.toString() ?? '',
      toestemmingSponsors: formData.get('toestemmingSponsors')?.toString() ?? '',
      toestemmingVideo: formData.get('toestemmingVideo')?.toString() ?? '',
    };

    try {
      const response = await fetch('/api/lidmaatschap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Er ging iets mis.');
      }

      setStatus('success');
      form.reset();
      setVoorWie('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-800 dark:bg-night-cyan/10 dark:border-night-cyan/25 dark:text-night-cyan">
        <p className="font-semibold mb-1">Bedankt voor je aanmelding!</p>
        <p className="text-sm dark:text-night-cyan/90">De ledenadministratie neemt binnenkort contact met je op.</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Voor wie */}
      <fieldset>
        <legend className={fieldLabel}>Ik vul dit formulier in voor</legend>
        <div className="space-y-2">
          <label className={radioLabel}>
            <input
              type="radio"
              name="voorWie"
              value="zelf"
              required
              checked={voorWie === 'zelf'}
              onChange={() => setVoorWie('zelf')}
              className="mt-1 accent-aqua"
            />
            Mijzelf (16 jaar of ouder)
          </label>
          <label className={radioLabel}>
            <input
              type="radio"
              name="voorWie"
              value="minderjarige"
              required
              checked={voorWie === 'minderjarige'}
              onChange={() => setVoorWie('minderjarige')}
              className="mt-1 accent-aqua"
            />
            Een minderjarige (jonger dan 16 jaar)
          </label>
        </div>
        {voorWie === 'minderjarige' && (
          <p className="text-xs text-sub mt-2 dark:text-night-sub">
            Vul hieronder de gegevens van de minderjarige in. Dit formulier wordt ingevuld door een ouder of
            verzorger.
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="naam" className={fieldLabel}>
          Naam
        </label>
        <input
          id="naam"
          name="naam"
          type="text"
          required
          className={textInput}
          placeholder="Volledige naam"
        />
      </div>

      {/* Geslacht */}
      <fieldset>
        <legend className={fieldLabel}>Geslacht</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className={radioLabel}>
            <input type="radio" name="geslacht" value="man" required className="mt-1 accent-aqua" />
            Man
          </label>
          <label className={radioLabel}>
            <input type="radio" name="geslacht" value="vrouw" required className="mt-1 accent-aqua" />
            Vrouw
          </label>
          <label className={radioLabel}>
            <input type="radio" name="geslacht" value="anders" required className="mt-1 accent-aqua" />
            Anders / wil ik niet aangeven
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="geboortedatum" className={fieldLabel}>
          Geboortedatum
        </label>
        <input id="geboortedatum" name="geboortedatum" type="date" required className={textInput} />
      </div>
      <div>
        <label htmlFor="adres" className={fieldLabel}>
          Adres
        </label>
        <input
          id="adres"
          name="adres"
          type="text"
          required
          className={textInput}
          placeholder="Straat en huisnummer"
        />
      </div>
      <div>
        <label htmlFor="postcodeWoonplaats" className={fieldLabel}>
          Postcode en woonplaats
        </label>
        <input
          id="postcodeWoonplaats"
          name="postcodeWoonplaats"
          type="text"
          required
          className={textInput}
          placeholder="3911 PG Rhenen"
        />
      </div>
      <div>
        <label htmlFor="email" className={fieldLabel}>
          Email
        </label>
        <input id="email" name="email" type="email" required className={textInput} placeholder="jouw@email.com" />
      </div>
      <div>
        <label htmlFor="telefoon" className={fieldLabel}>
          Telefoonnummer
        </label>
        <input id="telefoon" name="telefoon" type="tel" required className={textInput} placeholder="06 12345678" />
      </div>

      {/* Trainingsfrequentie */}
      <fieldset>
        <legend className={fieldLabel}>Aantal trainingen per week</legend>
        <div className="space-y-2">
          <label className={radioLabel}>
            <input type="radio" name="trainingenPerWeek" value="1" required className="mt-1 accent-aqua" />
            1 keer per week (woensdag of vrijdag)
          </label>
          <label className={radioLabel}>
            <input type="radio" name="trainingenPerWeek" value="2" required className="mt-1 accent-aqua" />
            2 keer per week (woensdag en vrijdag)
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="opmerkingen" className={fieldLabel}>
          Opmerkingen <span className="text-sub font-normal dark:text-night-sub">(optioneel)</span>
        </label>
        <textarea
          id="opmerkingen"
          name="opmerkingen"
          rows={4}
          className={textInput}
          placeholder="Bijvoorbeeld zwemervaring of medische bijzonderheden"
        />
      </div>

      {/* Lidwordingsverklaring */}
      <div className="border-t border-line pt-6 dark:border-night-line">
        <label className="flex items-start gap-3 text-sm text-ink dark:text-night-ink">
          <input type="checkbox" name="akkoordLidwording" required className="mt-1 accent-aqua" />
          <span>
            Ik verklaar hierbij dat ik lid word van Zwemvereniging de Blauwe Schuur. Ik ken en ga akkoord met de{' '}
            <a
              href="/pages/lidmaatschap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aqua underline hover:text-aqua-dark dark:text-night-cyan dark:hover:text-night-violet"
            >
              voorwaarden voor het lidmaatschap en opzegging daarvan
            </a>
            .
          </span>
        </label>
      </div>

      {/* Privacy toestemmingen */}
      <div className="border-t border-line pt-6 space-y-6 dark:border-night-line">
        <h3 className="text-sm font-semibold text-ink dark:text-night-ink">Toestemmingen</h3>

        <fieldset>
          <legend className="text-sm text-ink mb-2 dark:text-night-ink">
            Ik geef toestemming voor het publiceren van bijvoorbeeld foto&apos;s en/of filmpjes van mij op website
            en social media kanalen
          </legend>
          <div className="flex gap-6">
            <label className={radioLabel}>
              <input type="radio" name="toestemmingFotos" value="ja" required className="accent-aqua" />
              Ja
            </label>
            <label className={radioLabel}>
              <input type="radio" name="toestemmingFotos" value="nee" required className="accent-aqua" />
              Nee
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm text-ink mb-2 dark:text-night-ink">
            Ik geef toestemming voor het beschikbaar stellen van mijn naam en e-mailadres aan sponsors van de
            vereniging zodat zij mij kunnen benaderen voor aanbiedingen
          </legend>
          <div className="flex gap-6">
            <label className={radioLabel}>
              <input type="radio" name="toestemmingSponsors" value="ja" required className="accent-aqua" />
              Ja
            </label>
            <label className={radioLabel}>
              <input type="radio" name="toestemmingSponsors" value="nee" required className="accent-aqua" />
              Nee
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm text-ink mb-2 dark:text-night-ink">
            Ik geef toestemming voor het opslaan van videomateriaal ter ondersteuning van de zwemtrainingen en
            verbetering van zwemtechniek
          </legend>
          <div className="flex gap-6">
            <label className={radioLabel}>
              <input type="radio" name="toestemmingVideo" value="ja" required className="accent-aqua" />
              Ja
            </label>
            <label className={radioLabel}>
              <input type="radio" name="toestemmingVideo" value="nee" required className="accent-aqua" />
              Nee
            </label>
          </div>
        </fieldset>

        <p className="text-xs text-sub dark:text-night-sub">
          Mijn toestemming geldt alleen voor de hierboven aangevinkte en beschreven redenen, gegevens en
          organisaties. Voor nieuwe gegevensverwerkingen vraagt de vereniging mij opnieuw om toestemming. Ik mag
          mijn toestemming op elk moment intrekken.
        </p>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-gradient-to-r from-aqua to-aqua-dark dark:from-night-cyan dark:to-night-violet text-white dark:text-night-bg py-3 rounded-xl font-bold shadow-lg shadow-aqua/30 dark:shadow-night-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Versturen...' : 'Aanmelden als lid'}
      </button>
    </form>
  );
}

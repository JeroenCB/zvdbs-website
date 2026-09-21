'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ProefzwemmenForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      naam: formData.get('naam')?.toString() ?? '',
      geboortedatum: formData.get('geboortedatum')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      telefoon: formData.get('telefoon')?.toString() ?? '',
      zwemdiplomaAB: formData.get('zwemdiplomaAB')?.toString() ?? '',
      opmerkingen: formData.get('opmerkingen')?.toString() ?? '',
    };

    try {
      const response = await fetch('/api/proefzwemmen', {
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
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-800 dark:bg-night-cyan/10 dark:border-night-cyan/25 dark:text-night-cyan">
        <p className="font-semibold mb-1">Bedankt voor je aanmelding!</p>
        <p className="text-sm dark:text-night-cyan/90">We nemen contact met je op om een proefzwemles in te plannen.</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="naam" className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Naam
        </label>
        <input
          id="naam"
          name="naam"
          type="text"
          required
          className="w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan"
          placeholder="Naam van de zwemmer"
        />
      </div>
      <div>
        <label htmlFor="geboortedatum" className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Geboortedatum
        </label>
        <input
          id="geboortedatum"
          name="geboortedatum"
          type="date"
          required
          className="w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan"
          placeholder="jouw@email.com"
        />
      </div>
      <div>
        <label htmlFor="telefoon" className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Telefoonnummer
        </label>
        <input
          id="telefoon"
          name="telefoon"
          type="tel"
          required
          className="w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan"
          placeholder="06 12345678"
        />
      </div>
      <fieldset>
        <legend className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Heb je zwemdiploma A en B?
        </legend>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink dark:text-night-ink">
            <input type="radio" name="zwemdiplomaAB" value="ja" required className="accent-aqua" />
            Ja
          </label>
          <label className="flex items-center gap-2 text-sm text-ink dark:text-night-ink">
            <input type="radio" name="zwemdiplomaAB" value="nee" required className="accent-aqua" />
            Nee
          </label>
        </div>
      </fieldset>
      <div>
        <label htmlFor="opmerkingen" className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Opmerkingen <span className="text-sub font-normal dark:text-night-sub">(optioneel)</span>
        </label>
        <textarea
          id="opmerkingen"
          name="opmerkingen"
          rows={4}
          className="w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan"
          placeholder="Bijvoorbeeld zwemervaring of een voorkeursdag"
        />
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
        {status === 'submitting' ? 'Versturen...' : 'Aanmelden voor proefzwemmen'}
      </button>
    </form>
  );
}

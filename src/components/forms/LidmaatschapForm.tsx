'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LidmaatschapForm() {
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
      adres: formData.get('adres')?.toString() ?? '',
      postcodeWoonplaats: formData.get('postcodeWoonplaats')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      telefoon: formData.get('telefoon')?.toString() ?? '',
      opmerkingen: formData.get('opmerkingen')?.toString() ?? '',
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
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-6 text-green-800">
        <p className="font-semibold mb-1">Bedankt voor je aanmelding!</p>
        <p className="text-sm">De ledenadministratie neemt binnenkort contact met je op.</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="naam" className="block text-sm font-medium text-gray-900 mb-2">
          Naam
        </label>
        <input
          id="naam"
          name="naam"
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
          placeholder="Volledige naam"
        />
      </div>
      <div>
        <label htmlFor="geboortedatum" className="block text-sm font-medium text-gray-900 mb-2">
          Geboortedatum
        </label>
        <input
          id="geboortedatum"
          name="geboortedatum"
          type="date"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="adres" className="block text-sm font-medium text-gray-900 mb-2">
          Adres
        </label>
        <input
          id="adres"
          name="adres"
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
          placeholder="Straat en huisnummer"
        />
      </div>
      <div>
        <label htmlFor="postcodeWoonplaats" className="block text-sm font-medium text-gray-900 mb-2">
          Postcode en woonplaats
        </label>
        <input
          id="postcodeWoonplaats"
          name="postcodeWoonplaats"
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
          placeholder="3911 PG Rhenen"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
          placeholder="jouw@email.com"
        />
      </div>
      <div>
        <label htmlFor="telefoon" className="block text-sm font-medium text-gray-900 mb-2">
          Telefoonnummer
        </label>
        <input
          id="telefoon"
          name="telefoon"
          type="tel"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
          placeholder="06 12345678"
        />
      </div>
      <div>
        <label htmlFor="opmerkingen" className="block text-sm font-medium text-gray-900 mb-2">
          Opmerkingen <span className="text-gray-400 font-normal">(optioneel)</span>
        </label>
        <textarea
          id="opmerkingen"
          name="opmerkingen"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
          placeholder="Bijvoorbeeld zwemervaring of medische bijzonderheden"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Versturen...' : 'Aanmelden als lid'}
      </button>
    </form>
  );
}

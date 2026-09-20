'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
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
      email: formData.get('email')?.toString() ?? '',
      bericht: formData.get('bericht')?.toString() ?? '',
    };

    try {
      const response = await fetch('/api/contact', {
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
        <p className="font-semibold mb-1">Bedankt voor je bericht!</p>
        <p className="text-sm dark:text-night-cyan/90">We nemen zo snel mogelijk contact met je op.</p>
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
          placeholder="Jouw naam"
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
        <label htmlFor="bericht" className="block text-sm font-medium text-ink mb-2 dark:text-night-ink">
          Bericht
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={5}
          className="w-full px-4 py-2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:placeholder:text-night-sub/60 dark:focus:ring-night-cyan/30 dark:focus:border-night-cyan"
          placeholder="Je bericht hier..."
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
        {status === 'submitting' ? 'Versturen...' : 'Verzenden'}
      </button>
      <p className="text-xs text-sub dark:text-night-sub">We antwoorden meestal binnen 24 uur.</p>
    </form>
  );
}

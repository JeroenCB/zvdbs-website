'use client';

import { useEffect, useRef, useState } from 'react';
import { HONEYPOT_VELD, STARTED_AT_VELD, TURNSTILE_VELD } from '@/lib/antispam-velden';

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      language?: string;
      theme?: 'auto' | 'light' | 'dark';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let huidigWidgetId: string | null = null;

/** Vraagt een nieuw Turnstile-token aan. Aanroepen na een mislukte verzending (een token werkt maar één keer). */
export function resetTurnstile() {
  document
    .querySelectorAll<HTMLInputElement>(`input[name="${TURNSTILE_VELD}"]`)
    .forEach((input) => (input.value = ''));
  if (huidigWidgetId && window.turnstile) {
    try {
      window.turnstile.reset(huidigWidgetId);
    } catch {
      /* widget bestaat niet meer */
    }
  }
}

function laadTurnstileScript(onReady: () => void) {
  if (window.turnstile) {
    onReady();
    return;
  }
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
  script.addEventListener('load', onReady, { once: true });
}

/**
 * Onzichtbare en beveiligingsvelden tegen bots. Moet binnen een <form> staan.
 * - Lokveld (honeypot): voor mensen onzichtbaar, bots vullen het vaak wel in.
 * - startedAt: laadtijdstip; de server weigert te snelle verzendingen.
 * - Cloudflare Turnstile: de echte controle; het token wordt server-side geverifieerd.
 */
export default function AntispamVelden() {
  const [startedAt, setStartedAt] = useState('');
  const widgetContainer = useRef<HTMLDivElement>(null);
  const tokenInput = useRef<HTMLInputElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (!siteKey) return;
    let widgetId: string | null = null;
    let geannuleerd = false;

    laadTurnstileScript(() => {
      if (geannuleerd || !window.turnstile || !widgetContainer.current) return;
      widgetId = window.turnstile.render(widgetContainer.current, {
        sitekey: siteKey,
        language: 'nl',
        theme: 'auto',
        callback: (token) => {
          if (tokenInput.current) tokenInput.current.value = token;
        },
        'expired-callback': () => {
          if (tokenInput.current) tokenInput.current.value = '';
        },
        'error-callback': () => {
          if (tokenInput.current) tokenInput.current.value = '';
        },
      });
      huidigWidgetId = widgetId;
    });

    return () => {
      geannuleerd = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* al verwijderd */
        }
      }
      if (huidigWidgetId === widgetId) huidigWidgetId = null;
    };
  }, [siteKey]);

  return (
    <>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
      >
        <label htmlFor={HONEYPOT_VELD}>Laat dit veld leeg</label>
        <input
          id={HONEYPOT_VELD}
          name={HONEYPOT_VELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name={STARTED_AT_VELD} value={startedAt} readOnly />
      <input ref={tokenInput} type="hidden" name={TURNSTILE_VELD} defaultValue="" />
      <div ref={widgetContainer} />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { HONEYPOT_VELD, STARTED_AT_VELD } from '@/lib/antispam-velden';

/**
 * Onzichtbare velden tegen bots. Moet binnen een <form> staan.
 * - Lokveld: voor mensen onzichtbaar, bots vullen het vaak wel in.
 * - startedAt: tijdstip waarop het formulier geladen werd; de server weigert te snelle verzendingen.
 */
export default function AntispamVelden() {
  const [startedAt, setStartedAt] = useState('');

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

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
    </>
  );
}

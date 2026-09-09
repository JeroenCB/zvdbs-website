import { JWT } from 'google-auth-library';

/**
 * Leest bereiken uit een PRIVATE Google Sheet via een service account.
 * De private key blijft altijd server-side. Nooit importeren in een 'use client' component.
 */

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

function getClient(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email) throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL ontbreekt');
  if (!rawKey) throw new Error('GOOGLE_PRIVATE_KEY ontbreekt');

  // Vercel slaat newlines vaak op als letterlijke \n. Beide vormen worden hier ondersteund.
  const key = rawKey.replace(/\\n/g, '\n');

  if (!key.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY lijkt onvolledig: "BEGIN PRIVATE KEY" ontbreekt. ' +
        'Kopieer de volledige waarde uit het JSON-bestand, inclusief de BEGIN/END regels.'
    );
  }

  return new JWT({ email, key, scopes: SCOPES });
}

/**
 * Haalt meerdere bereiken op in EEN API-call.
 * Geeft per bereik een 2D-array van strings terug, zoals ze in de sheet worden weergegeven.
 */
export async function batchGetRanges(ranges: string[]): Promise<string[][][]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID ontbreekt');

  const client = getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Geen access token ontvangen van Google');

  const params = new URLSearchParams();
  ranges.forEach((r) => params.append('ranges', r));
  // FORMATTED_VALUE = precies wat je in de sheet ziet (tijden blijven leesbaar)
  params.set('valueRenderOption', 'FORMATTED_VALUE');
  params.set('majorDimension', 'ROWS');

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?` +
    params.toString();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = await res.json();
  return (data.valueRanges || []).map((vr: any) => vr.values || []);
}

/** "113,19" of "113.19" -> 113.19. Lege of onparseerbare waarde -> null. */
export function parseDutchNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (s === '') return null;
  const n = parseFloat(s.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** "1:24,42" / "0:00:16,01" / "16,01" -> aantal seconden. Anders null. */
export function timeToSeconds(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (s === '') return null;

  const parts = s.split(':').map((p) => p.trim());
  const nums = parts.map((p) => parseFloat(p.replace(',', '.')));
  if (nums.some((n) => !Number.isFinite(n))) return null;

  if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2];
  if (nums.length === 2) return nums[0] * 60 + nums[1];
  if (nums.length === 1) return nums[0];
  return null;
}

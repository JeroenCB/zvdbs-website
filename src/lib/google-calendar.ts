import { getClient } from '@/lib/google-sheets';

/**
 * Leest de openbare Google-agenda "DBS activiteiten" uit via hetzelfde service
 * account als de clubrecords. De agenda is openbaar, dus hoeft niet gedeeld te
 * worden met het service account; wel moet de Google Calendar API aan staan in
 * het Cloud-project. Nooit importeren in een 'use client' component.
 */

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

/** Niet geheim: de agenda is openbaar. Via GOOGLE_CALENDAR_ID te overschrijven. */
export const AGENDA_ID =
  process.env.GOOGLE_CALENDAR_ID || 'f6q3i2lvul3nt829kq52armngs@group.calendar.google.com';

export interface Activiteit {
  id: string;
  titel: string;
  locatie: string;
  /** Hele dag: "2026-11-01". Anders ISO-tijd met offset. */
  start: string;
  /** Hele dag: dag NA de laatste dag (zo levert Google het aan). */
  eind: string;
  heleDag: boolean;
}

/**
 * Activiteiten van nu tot `dagen` dagen vooruit, op volgorde van start.
 * Herhalende afspraken komen als losse items terug (singleEvents=true).
 * Een activiteit die al bezig is, telt ook mee.
 */
export async function getKomendeActiviteiten(dagen = 30): Promise<Activiteit[]> {
  const client = getClient(SCOPES);
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Geen access token ontvangen van Google');

  const nu = new Date();
  const tot = new Date(nu.getTime() + dagen * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    timeMin: nu.toISOString(),
    timeMax: tot.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '100',
    timeZone: 'Europe/Amsterdam',
  });

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(AGENDA_ID)}/events?` +
    params.toString();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Calendar API ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = await res.json();
  return (data.items || [])
    .filter((e: any) => e.status !== 'cancelled' && (e.start?.date || e.start?.dateTime))
    .map((e: any) => ({
      id: e.id,
      titel: e.summary || 'Activiteit',
      locatie: e.location || '',
      start: e.start.date || e.start.dateTime,
      eind: e.end?.date || e.end?.dateTime || e.start.date || e.start.dateTime,
      heleDag: Boolean(e.start.date),
    }));
}

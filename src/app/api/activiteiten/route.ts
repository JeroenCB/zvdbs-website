import { NextResponse } from 'next/server';
import { getKomendeActiviteiten } from '@/lib/google-calendar';

// Ververst maximaal 1x per uur. Nieuwe activiteiten verschijnen dus met wat vertraging.
export const revalidate = 3600;

function diagnose(message: string): string {
  if (message.includes('ontbreekt'))
    return 'Een omgevingsvariabele is niet ingesteld. Controleer GOOGLE_SERVICE_ACCOUNT_EMAIL en GOOGLE_PRIVATE_KEY in Vercel.';
  if (message.includes('has not been used in project') || message.includes('is disabled'))
    return 'De Google Calendar API staat uit in het Cloud-project van het service account.';
  if (message.includes('404'))
    return 'Agenda niet gevonden. Controleer de agenda-ID en of de agenda nog openbaar is.';
  if (message.includes('403'))
    return 'Geen toegang tot de agenda. Staat "Openbaar maken" nog aan bij de agenda?';
  return message;
}

export async function GET() {
  try {
    const activiteiten = await getKomendeActiviteiten(30);
    return NextResponse.json({
      success: true,
      count: activiteiten.length,
      activiteiten,
      lastFetched: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende fout';
    console.error('[api/activiteiten]', message);
    return NextResponse.json(
      {
        success: false,
        error: message,
        hint: diagnose(message),
      },
      { status: 500 }
    );
  }
}

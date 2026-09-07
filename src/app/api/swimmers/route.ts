import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

interface Swimmer {
  [key: string]: any;
  points?: number;
}

let cachedAuth: any = null;

async function getAuthClient() {
  // Use cached auth for performance
  if (cachedAuth) {
    return cachedAuth;
  }

  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const projectId = process.env.GOOGLE_SHEETS_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Missing Google credentials (GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PROJECT_ID)');
  }

  // Replace literal \n with actual newlines
  const formattedKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: projectId,
      private_key_id: 'key-id',
      private_key: formattedKey,
      client_email: clientEmail,
      client_id: '1',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  cachedAuth = auth;
  return auth;
}

export async function GET(request: NextRequest) {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    const gid = process.env.GOOGLE_SHEETS_GID;

    if (!sheetId || !gid) {
      return NextResponse.json(
        { error: 'Sheet ID or GID not configured' },
        { status: 500 }
      );
    }

    console.log('📊 Authenticating with Google Sheets API...');

    // Get auth client
    const auth = await getAuthClient();

    // Create Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });

    console.log('✅ Fetching from Adelskalender sheet...');

    // Fetch data from sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Adelskalender!A:AD', // Get columns A through AD
    });

    const values = response.data.values;

    if (!values || values.length < 2) {
      return NextResponse.json(
        { error: 'No data found in Adelskalender sheet' },
        { status: 400 }
      );
    }

    const headers = values[0];
    console.log('✅ Headers found:', headers.slice(0, 10));

    // Find column indices
    const colA = findColumnIndex(headers, ['a', 'naam', 'name', 'persoon']);
    const colAD = findColumnIndex(headers, ['ad', 'ck', 'ck 2', 'c.k. 2']);
    const colB = findColumnIndex(headers, ['b', 'categorie', 'category']);

    console.log('✅ Column indices:', { colA, colB, colAD });

    // Parse swimmers
    const swimmers: Swimmer[] = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const nameCell = colA >= 0 ? row[colA] : row[0];

      if (!nameCell || nameCell.trim() === '') continue;

      const swimmer: Swimmer = {};

      headers.forEach((header: string, idx: number) => {
        const key = header.toLowerCase().trim().replace(/\s+/g, '_');
        swimmer[key] = row[idx] || '';
      });

      if (colAD >= 0 && row[colAD]) {
        swimmer.points = parseFloat(row[colAD]) || 0;
      }

      swimmers.push(swimmer);
    }

    // Sort by points
    swimmers.sort((a, b) => {
      const aPoints = typeof a.points === 'number' ? a.points : 0;
      const bPoints = typeof b.points === 'number' ? b.points : 0;
      return bPoints - aPoints;
    });

    console.log(`✅ Loaded ${swimmers.length} swimmers`);

    return NextResponse.json({
      success: true,
      count: swimmers.length,
      swimmers: swimmers.slice(0, 100),
      allSwimmers: swimmers,
      headers: headers.slice(0, 50),
      columnAD: colAD,
      columnA: colA,
      columnB: colB,
      lastFetched: new Date().toISOString(),
      source: 'Google Sheets API v4 (Service Account)',
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch swimmer data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function findColumnIndex(headers: string[], searchTerms: string[]): number {
  return headers.findIndex((header: string) => {
    const normalized = header.toLowerCase().trim();
    return searchTerms.some((term) => normalized.includes(term.toLowerCase()));
  });
}

import { NextRequest, NextResponse } from 'next/server';

interface Swimmer {
  [key: string]: any;
  points?: number;
}

export async function GET(request: NextRequest) {
  try {
    // Environment variables
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    const gid = process.env.GOOGLE_SHEETS_GID;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

    if (!sheetId || !gid || !privateKey || !clientEmail) {
      return NextResponse.json(
        { error: 'Google Sheets credentials not configured' },
        { status: 500 }
      );
    }

    // Fetch CSV via unauthenticated export (works for shared sheets)
    // Or use Google Sheets API with service account
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

    const response = await fetch(csvUrl, {
      headers: {
        'User-Agent': 'ZVDBS-Website/1.0',
      },
    });

    if (!response.ok) {
      console.error('Google Sheets fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch Google Sheet: ${response.statusText}` },
        { status: response.status }
      );
    }

    const csvText = await response.text();

    // Parse CSV
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return NextResponse.json({ error: 'No data in sheet' }, { status: 400 });
    }

    // Parse header line
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);

    // Find column indices
    const colA = findColumnIndex(headers, ['a', 'naam', 'name', 'persoon']);
    const colAD = findColumnIndex(headers, ['ad', 'ck', 'ck 2', 'c.k. 2', 'adelskalender']);
    const colB = findColumnIndex(headers, ['b', 'categorie', 'category', 'cat']);

    console.log('✅ Google Sheets API - Column indices:', { colA, colB, colAD });

    // Parse data rows
    const swimmers: Swimmer[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);

      // Skip empty rows
      const nameCell = colA >= 0 ? cells[colA] : cells[0];
      if (!nameCell || nameCell.trim() === '') continue;

      const swimmer: Swimmer = {};

      // Map all columns
      headers.forEach((header, idx) => {
        const key = header.toLowerCase().trim().replace(/\s+/g, '_');
        swimmer[key] = cells[idx] || '';
      });

      // Parse C.K. 2 points
      if (colAD >= 0 && cells[colAD]) {
        swimmer.points = parseFloat(cells[colAD]) || 0;
      }

      swimmers.push(swimmer);
    }

    // Sort by points (C.K. 2)
    swimmers.sort((a, b) => {
      const aPoints = typeof a.points === 'number' ? a.points : 0;
      const bPoints = typeof b.points === 'number' ? b.points : 0;
      return bPoints - aPoints;
    });

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
      source: 'Google Sheets (Adelskalender)',
    });
  } catch (error) {
    console.error('❌ Error fetching swimmers:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch swimmer data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function findColumnIndex(headers: string[], searchTerms: string[]): number {
  return headers.findIndex((header) => {
    const normalized = header.toLowerCase().trim();
    return searchTerms.some((term) => normalized.includes(term.toLowerCase()));
  });
}

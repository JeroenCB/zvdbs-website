import { NextRequest, NextResponse } from 'next/server';

interface Swimmer {
  [key: string]: any;
  points?: number;
}

export async function GET(request: NextRequest) {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    const gid = process.env.GOOGLE_SHEETS_GID;

    if (!sheetId || !gid) {
      return NextResponse.json(
        { error: 'Google Sheets ID or GID not configured' },
        { status: 500 }
      );
    }

    console.log('📊 Fetching CSV from Google Sheets...');

    // CSV export URL - works for public sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    console.log('CSV URL:', csvUrl);

    const response = await fetch(csvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('❌ Fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        {
          error: `Failed to fetch Google Sheet: ${response.statusText}`,
          hint: 'Sheet must be public or shared (Anyone with the link can view)',
          csvUrl: csvUrl,
        },
        { status: response.status }
      );
    }

    const csvText = await response.text();

    if (!csvText || csvText.length < 10) {
      console.error('❌ Empty CSV response');
      return NextResponse.json(
        { error: 'No data received from Google Sheet', csvLength: csvText.length },
        { status: 400 }
      );
    }

    // Parse CSV
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return NextResponse.json({ error: 'No data rows in sheet' }, { status: 400 });
    }

    const headers = parseCSVLine(lines[0]);
    console.log('✅ Headers found:', headers.length, 'columns');
    console.log('First 10 headers:', headers.slice(0, 10));

    // Find column indices
    const colA = findColumnIndex(headers, ['a', 'naam', 'name', 'persoon']);
    const colAD = findColumnIndex(headers, ['ad', 'ck', 'ck 2', 'c.k. 2', 'adelskalender']);
    const colB = findColumnIndex(headers, ['b', 'categorie', 'category']);

    console.log('✅ Column indices:', { colA, colB, colAD });

    // Parse swimmers
    const swimmers: Swimmer[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);
      const nameCell = colA >= 0 ? cells[colA] : cells[0];

      if (!nameCell || nameCell.trim() === '') continue;

      const swimmer: Swimmer = {};

      headers.forEach((header: string, idx: number) => {
        const key = header.toLowerCase().trim().replace(/\s+/g, '_');
        swimmer[key] = cells[idx] || '';
      });

      if (colAD >= 0 && cells[colAD]) {
        swimmer.points = parseFloat(cells[colAD]) || 0;
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
      source: 'Google Sheets CSV Export (Public)',
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
  return headers.findIndex((header: string) => {
    const normalized = header.toLowerCase().trim();
    return searchTerms.some((term) => normalized.includes(term.toLowerCase()));
  });
}

import { NextRequest, NextResponse } from 'next/server';

interface Swimmer {
  [key: string]: string | number;
}

export async function GET(request: NextRequest) {
  try {
    // Sheet ID en gid
    const SHEET_ID = '16dOjorzaP4sPdASHAZRDI-mM_vjvuI7H';
    const GID = '1100237926'; // Adelskalender sheet

    // Fetch CSV van Google Sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Google Sheet' }, { status: 500 });
    }

    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return NextResponse.json({ error: 'No data in sheet' }, { status: 400 });
    }

    // Parse header line properly (handle quotes)
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);
    
    // Find column indices for key fields
    const colA = findColumnIndex(headers, ['a', 'naam', 'name']); // Naam/Name
    const colAD = findColumnIndex(headers, ['ad', 'ck', 'ck 2', 'c.k. 2']); // C.K. 2
    const colB = findColumnIndex(headers, ['b', 'categorie', 'category']); // Categorie
    
    console.log('Column indices:', { colA, colB, colAD });
    console.log('First 5 headers:', headers.slice(0, 5));

    // Parse data rows
    const swimmers: Swimmer[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);
      
      // Zoek naam kolom (kolom A meestal, of eerste niet-lege kolom)
      const nameCell = colA >= 0 ? cells[colA] : cells[0];
      
      if (nameCell && nameCell.trim() !== '') {
        const swimmer: Swimmer = {};
        
        // Zet alle kolommen in het object
        headers.forEach((header, idx) => {
          swimmer[header.toLowerCase().trim()] = cells[idx] || '';
        });
        
        // Parse punten als nummer
        if (colAD >= 0) {
          swimmer['points'] = parseFloat(cells[colAD]) || 0;
        }
        
        swimmers.push(swimmer);
      }
    }

    // Sort by C.K. 2 (kolom AD) - default
    if (colAD >= 0) {
      swimmers.sort((a, b) => {
        const aPoints = typeof a.points === 'number' ? a.points : parseFloat(String(a.points)) || 0;
        const bPoints = typeof b.points === 'number' ? b.points : parseFloat(String(b.points)) || 0;
        return bPoints - aPoints;
      });
    }

    return NextResponse.json({
      success: true,
      count: swimmers.length,
      swimmers: swimmers.slice(0, 100), // Top 100
      allSwimmers: swimmers,
      headers: headers.slice(0, 40), // Toon eerste 40 kolommen
      columnAD: colAD,
      columnA: colA,
      columnB: colB,
      lastFetched: new Date().toISOString(),
      note: 'All column data preserved. Check headers array for available columns.'
    });
  } catch (error) {
    console.error('Error fetching swimmers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch swimmer data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to parse CSV line properly (handles quoted fields)
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

// Helper to find column index by multiple possible names
function findColumnIndex(headers: string[], searchTerms: string[]): number {
  return headers.findIndex(header => {
    const normalized = header.toLowerCase().trim();
    return searchTerms.some(term => normalized.includes(term.toLowerCase()));
  });
}

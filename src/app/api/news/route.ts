import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NEWS_FILE = path.join(process.cwd(), 'public/data/news.json');

export async function GET() {
  try {
    const data = fs.readFileSync(NEWS_FILE, 'utf-8');
    const news = JSON.parse(data);
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Read existing news
    let news = [];
    if (fs.existsSync(NEWS_FILE)) {
      const data = fs.readFileSync(NEWS_FILE, 'utf-8');
      news = JSON.parse(data);
    }

    // Check if article already exists (for updates)
    const existingIndex = news.findIndex((n: any) => n.id === body.id);

    if (existingIndex >= 0) {
      // Update existing article
      news[existingIndex] = body;
    } else {
      // Add new article
      news.push(body);
    }

    // Sort by date descending
    news.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Write back to file
    fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));

    return NextResponse.json({ success: true, article: body });
  } catch (error) {
    console.error('Error saving news:', error);
    return NextResponse.json({ error: 'Failed to save news' }, { status: 500 });
  }
}

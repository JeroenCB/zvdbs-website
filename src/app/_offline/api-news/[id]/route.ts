import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NEWS_FILE = path.join(process.cwd(), 'public/data/news.json');

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Read existing news
    const data = fs.readFileSync(NEWS_FILE, 'utf-8');
    let news = JSON.parse(data);

    // Filter out the article
    news = news.filter((n: any) => n.id !== id);

    // Write back to file
    fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';

/**
 * Nieuwsartikelen bevatten vaak een <img> als eerste element van de
 * gemigreerde WordPress-inhoud (echte foto's, gehost op zvdbs.nl). Die
 * gebruiken we als voorbeeldfoto op de nieuwskaarten, met een gradient
 * als terugval wanneer een artikel geen afbeelding heeft.
 */
function extractFirstImage(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function withImage(article: any) {
  return { ...article, image: extractFirstImage(article.content || '') };
}

export async function getPage(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public/data/pages.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const pages = JSON.parse(data);
    return pages.find((p: any) => p.slug === slug) || null;
  } catch (error) {
    console.error('Error loading page:', error);
    return null;
  }
}

export async function getAllPages() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/pages.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading pages:', error);
    return [];
  }
}

export async function getNews(limit?: number) {
  try {
    const filePath = path.join(process.cwd(), 'public/data/news.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    let news = JSON.parse(data);
    // Sort by date descending
    news.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    news = news.map(withImage);
    return limit ? news.slice(0, limit) : news;
  } catch (error) {
    console.error('Error loading news:', error);
    return [];
  }
}

export async function getNewsArticle(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public/data/news.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const news = JSON.parse(data);
    const article = news.find((n: any) => n.slug === slug) || null;
    return article ? withImage(article) : null;
  } catch (error) {
    console.error('Error loading news article:', error);
    return null;
  }
}

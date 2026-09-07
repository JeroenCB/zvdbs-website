'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
      setMessage('Fout bij het laden van artikelen');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = generateSlug(formData.title);
    const now = new Date().toISOString().split('T')[0];

    const newArticle: NewsArticle = {
      id: editingId || Math.max(...articles.map((a) => a.id), 0) + 1,
      slug,
      category: 'nieuws',
      date: now,
      ...formData,
    };

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });

      if (response.ok) {
        setMessage(
          editingId
            ? '✓ Artikel bijgewerkt'
            : '✓ Artikel toegevoegd - het verschijnt meteen op de website'
        );
        setFormData({ title: '', excerpt: '', content: '', author: '' });
        setIsEditing(false);
        setEditingId(null);
        loadArticles();

        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Fout bij het opslaan van het artikel');
      console.error('Error saving article:', error);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
    });
    setEditingId(article.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('✓ Artikel verwijderd');
        loadArticles();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Fout bij het verwijderen van het artikel');
      console.error('Error deleting article:', error);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-8">
            <p className="text-sm text-yellow-800">
              <strong>Admin Toegang:</strong> Deze pagina is alleen voor moderators. Artikelen
              verschijnen meteen op de website.
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-8">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {isEditing ? 'Artikel bewerken' : 'Nieuw artikel toevoegen'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Titel *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Titel van het artikel"
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Slug wordt automatisch gegenereerd: {generateSlug(formData.title) || '—'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Samenvatting *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                      placeholder="Korte samenvatting (max 200 woorden)"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Inhoud *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      placeholder="Volledige artikel inhoud..."
                      rows={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Je kunt HTML gebruiken voor opmaak (bijv. &lt;p&gt;, &lt;strong&gt;, &lt;img&gt;)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      placeholder="Jouw naam"
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-900 text-white py-3 rounded font-semibold hover:bg-blue-800 transition"
                    >
                      {isEditing ? 'Artikel bijwerken' : 'Artikel publiceren'}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingId(null);
                          setFormData({ title: '', excerpt: '', content: '', author: '' });
                        }}
                        className="flex-1 bg-gray-200 text-gray-900 py-3 rounded font-semibold hover:bg-gray-300 transition"
                      >
                        Annuleren
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Articles List */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recente artikelen</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {articles.slice(0, 10).map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded p-4 text-sm">
                      <p className="font-semibold text-gray-900 truncate">{article.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(article.date).toLocaleDateString('nl-NL')}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Door {article.author}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Bewerk
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-xs bg-red-100 text-red-900 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

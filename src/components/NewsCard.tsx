import Link from 'next/link';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
}

export default function NewsCard({ title, excerpt, category, date, slug }: NewsCardProps) {
  const categoryLabels: { [key: string]: string } = {
    nieuws: 'Nieuws',
    competitie: 'Competitie',
    update: 'Update',
    aankondiging: 'Aankondiging',
  };

  return (
    <Link href={`/nieuws/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image Placeholder */}
        <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
          Nieuwsfoto
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="text-xs text-gray-500 mb-2">
            {date} • {categoryLabels[category] || category}
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
            {excerpt}
          </p>
          <a href={`/nieuws/${slug}`} className="text-sm font-medium text-blue-900 hover:text-blue-700">
            Lees verder →
          </a>
        </div>
      </div>
    </Link>
  );
}

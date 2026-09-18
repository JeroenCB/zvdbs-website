import Link from 'next/link';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  image?: string | null;
}

const GRADIENTS = [
  'from-[#7DD3FC] to-[#0EA5E9]',
  'from-[#38BDF8] to-[#0891B2]',
  'from-[#67E8F9] to-[#0EA5E9]',
];

function gradientFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % GRADIENTS.length;
  return GRADIENTS[hash];
}

export default function NewsCard({ title, excerpt, category, date, slug, image }: NewsCardProps) {
  const categoryLabels: { [key: string]: string } = {
    nieuws: 'Nieuws',
    competitie: 'Competitie',
    update: 'Update',
    aankondiging: 'Aankondiging',
  };

  return (
    <Link href={`/news/${slug}`}>
      <div className="bg-white border border-line rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Foto uit het artikel, met gradient als terugval als er geen foto is */}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-40 object-cover" loading="lazy" />
        ) : (
          <div className={`w-full h-40 bg-gradient-to-br ${gradientFor(slug)}`} />
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="text-xs text-aqua font-semibold mb-2">
            {date} · {categoryLabels[category] || category}
          </div>
          <h3 className="text-base font-semibold text-ink mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-sub mb-4 flex-1 line-clamp-2">
            {excerpt}
          </p>
          <span className="text-sm font-semibold text-aqua hover:text-aqua-dark">
            Lees verder →
          </span>
        </div>
      </div>
    </Link>
  );
}

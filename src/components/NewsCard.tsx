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
      <div className="bg-white border border-line rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col dark:bg-white/[0.03] dark:border-night-line dark:backdrop-blur-sm dark:hover:shadow-none dark:hover:border-night-cyan/30">
        {/* Foto uit het artikel, met gradient als terugval als er geen foto is */}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-40 object-cover" loading="lazy" />
        ) : (
          <div className={`w-full h-40 bg-gradient-to-br ${gradientFor(slug)} dark:from-[#1E293B] dark:to-[#0F172A] relative dark:after:content-[''] dark:after:absolute dark:after:inset-0 dark:after:bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.25),transparent_60%)]`} />
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="text-xs text-aqua font-semibold mb-2 dark:text-night-violet">
            {date} · {categoryLabels[category] || category}
          </div>
          <h3 className="text-base font-semibold text-ink mb-2 line-clamp-2 dark:text-night-ink">
            {title}
          </h3>
          <p className="text-sm text-sub mb-4 flex-1 line-clamp-2 dark:text-night-sub">
            {excerpt}
          </p>
          <span className="text-sm font-semibold text-aqua hover:text-aqua-dark dark:text-night-cyan dark:hover:text-night-violet">
            Lees verder →
          </span>
        </div>
      </div>
    </Link>
  );
}

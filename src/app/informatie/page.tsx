import { Suspense } from 'react';
import { getPage } from '@/lib/pages';
import InformatiePageClient, { InformatieTabPage } from './InformatiePageClient';

const TAB_SLUGS = ['informatie', 'wie', 'historie', 'privacy', 'preventief'] as const;

export default async function InformatiePage() {
  const paginas = await Promise.all(TAB_SLUGS.map((slug) => getPage(slug)));

  const pages: InformatieTabPage[] = TAB_SLUGS.map((slug, i) => ({
    slug,
    title: paginas[i]?.title ?? slug,
    content: paginas[i]?.content ?? null,
  }));

  return (
    <Suspense fallback={null}>
      <InformatiePageClient pages={pages} />
    </Suspense>
  );
}

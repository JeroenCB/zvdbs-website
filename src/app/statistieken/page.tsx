import { Suspense } from 'react';
import RecordsPageClient from './RecordsPageClient';

export default function StatistiekenPage() {
  return (
    <Suspense fallback={null}>
      <RecordsPageClient />
    </Suspense>
  );
}

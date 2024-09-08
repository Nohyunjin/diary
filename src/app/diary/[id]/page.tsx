'use client';

import DiaryViewPage from '@/view/diary/DiaryViewPage';
import { Suspense } from 'react';

export default function DiaryView({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DiaryViewPage id={params.id} />
    </Suspense>
  );
}

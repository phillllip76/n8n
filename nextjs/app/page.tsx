"use client";
export const dynamic = 'force-dynamic';
import { CanvasBackgroundWithGrid } from '@/components/canvas/elements/background/CanvasBackground';
import { useState } from 'react';

export default function Page() {
  const [zoom] = useState(1);
  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <CanvasBackgroundWithGrid striped viewport={{ x: 0, y: 0, zoom }} />
    </main>
  );
}

'use client';

import React, { useMemo } from 'react';

type Props = {
  id: string;
  x: number;
  y: number;
  zoom: number;
};

export default function CanvasBackgroundStripedPattern({ id, x, y, zoom }: Props) {
  const scaledGap = useMemo(() => (zoom ? 20 * zoom : 1), [zoom]);
  const patternOffset = useMemo(() => scaledGap / 2, [scaledGap]);

  // CSS var compatibility: consumers should define --color-canvas-read-only-line
  const strokeStyle: React.CSSProperties = {
    stroke: 'var(--color-canvas-read-only-line)'
  };

  return (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      x={(x % scaledGap) as unknown as number}
      y={(y % scaledGap) as unknown as number}
      width={scaledGap}
      height={scaledGap}
      patternTransform={`rotate(135) translate(-${patternOffset},-${patternOffset})`}
    >
      <path d={`M0 ${scaledGap / 2} H${scaledGap}`} strokeWidth={scaledGap / 2} style={strokeStyle} />
    </pattern>
  );
}


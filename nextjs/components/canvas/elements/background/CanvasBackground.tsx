'use client';

import React from 'react';
import { Background } from 'reactflow';
import CanvasBackgroundStripedPattern from './CanvasBackgroundStripedPattern';

export type ViewportTransform = {
  x: number;
  y: number;
  zoom: number;
};

export const GRID_SIZE = 16; // from nodeViewUtils GRID_SIZE

type Props = {
  striped: boolean;
  viewport: ViewportTransform;
};

export default function CanvasBackground({ striped, viewport }: Props) {
  const patternId = 'n8n-canvas-bg-striped';
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Define the pattern */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        {striped && (
          <CanvasBackgroundStripedPattern id={patternId} x={viewport.x} y={viewport.y} zoom={viewport.zoom} />
        )}
      </svg>
      {/* Apply the pattern as an overlay */}
      {striped && (
        <svg width="100%" height="100%" style={{ display: 'block' }}>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      )}
    </div>
  );
}

// Helper component to combine with React Flow Background when needed
export function CanvasBackgroundWithGrid({ striped, viewport }: Props) {
  const patternId = 'n8n-canvas-bg-striped';
  return (
    <>
      <CanvasBackground striped={striped} viewport={viewport} />
      <Background id="rf-grid-bg" color="#aaa" gap={GRID_SIZE} />
    </>
  );
}


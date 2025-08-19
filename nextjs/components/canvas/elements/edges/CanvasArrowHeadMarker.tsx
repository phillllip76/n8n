'use client';

import React from 'react';

type Props = { id: string };

/**
 * Arrow head marker definition, to be referenced from SVG edges via:
 * markerEnd="url(#<id>)" or markerStart.
 *
 * Mirrors CanvasArrowHeadMarker.vue from the Vue codebase.
 */
export default function CanvasArrowHeadMarker({ id }: Props) {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        <marker
          id={id}
          viewBox="-10 -10 20 20"
          refX={0}
          refY={0}
          markerWidth={12.5}
          markerHeight={12.5}
          markerUnits="strokeWidth"
          orient="auto-start-reverse"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            points="-5,-4 0,0 -5,4 -5,-4"
            strokeWidth={2}
            stroke="context-stroke"
            fill="context-stroke"
          />
        </marker>
      </defs>
    </svg>
  );
}


'use client';
import React from 'react';

export function N8nTooltip({ children, content, placement, showAfter }: any) {
  return (
    <span title={typeof content === 'string' ? content : undefined} data-placement={placement} data-delay={showAfter}>
      {children}
    </span>
  );
}

export function N8nText({ children }: any) {
  return <span>{children}</span>;
}

export function N8nIconButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string }) {
  return (
    <button {...props} />
  );
}

export function N8nIcon({ icon, size, spin }: { icon: string; size?: string; spin?: boolean }) {
  const map: Record<string, string> = {
    clock: '🕒',
    'refresh-cw': '⟳',
    power: '⏻',
    'node-error': '⚠️',
    'node-pin': '📌',
    'node-dirty': '✱',
    'node-success': '✔️',
  };
  return <span style={{ display: 'inline-block', animation: spin ? 'spin 1s linear infinite' : undefined }}>{map[icon] ?? '•'}</span>;
}


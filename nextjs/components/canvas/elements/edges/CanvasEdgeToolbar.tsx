'use client';

import React from 'react';

export type NodeConnectionType = string;
export const NodeConnectionTypes = { Main: 'main' } as const;

type Props = {
  type: NodeConnectionType;
  onAdd: () => void;
  onDelete: () => void;
};

export default function CanvasEdgeToolbar({ type, onAdd, onDelete }: Props) {
  const isAddButtonVisible = type === NodeConnectionTypes.Main;
  return (
    <div className="canvas-edge-toolbar" data-test-id="canvas-edge-toolbar" style={styles.wrapper}>
      {isAddButtonVisible && (
        <button
          className="canvas-edge-toolbar-button"
          data-test-id="add-connection-button"
          title="Add"
          onClick={onAdd}
          style={styles.button}
        >
          +
        </button>
      )}
      <button
        className="canvas-edge-toolbar-button"
        data-test-id="delete-connection-button"
        title="Delete"
        onClick={onDelete}
        style={styles.button}
      >
        🗑
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    pointerEvents: 'all',
    padding: '4px',
    transform: 'scale(var(--canvas-zoom-compensation-factor, 1))',
    background: 'transparent',
  },
  button: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'var(--color-foreground-xdark, #444)'
  },
};


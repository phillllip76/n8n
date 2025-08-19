'use client';

import React, { useMemo, useState } from 'react';
import styles from './CanvasNodeToolbar.module.css';
import CanvasNodeStatusIcons from '@/components/canvas/elements/nodes/render-types/parts/CanvasNodeStatusIcons';
import { N8nTooltip, N8nIconButton } from '@n8n/design-system';
import { useI18n } from '@n8n/i18n';

export type CanvasNodeRenderType = 'default' | 'n8n-nodes-base.stickyNote';

type Props = {
  readOnly?: boolean;
  showStatusIcons: boolean;
  itemsClass?: string;
  // state injected by parent (React equivalent of useCanvas/useCanvasNode)
  isExecuting?: boolean;
  isExperimentalNdvActive?: boolean;
  isDisabled?: boolean;
  renderType?: CanvasNodeRenderType;
  nodeId?: string;
  isToolNode?: boolean;
  onRun?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
  onUpdate?: (params: Record<string, unknown>) => void;
  onOpenContextMenu?: (event: React.MouseEvent) => void;
  onFocus?: (id: string) => void;
};

export default function CanvasNodeToolbar({
  readOnly,
  showStatusIcons,
  itemsClass = '',
  isExecuting,
  isExperimentalNdvActive,
  isDisabled,
  renderType = 'default',
  nodeId,
  isToolNode,
  onRun,
  onToggle,
  onDelete,
  onUpdate,
  onOpenContextMenu,
  onFocus,
}: Props) {
  const i18n = useI18n();
  const [isStickyColorSelectorOpen, setStickyColorSelectorOpen] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const classes = useMemo(
    () => [
      styles.canvasNodeToolbar,
      readOnly ? styles.readOnly : '',
      isHovered || isStickyColorSelectorOpen ? styles.forceVisible : '',
      isExperimentalNdvActive ? styles.isExperimentalNdvActive : '',
    ].join(' '),
    [readOnly, isHovered, isStickyColorSelectorOpen, isExperimentalNdvActive],
  );

  const isExecuteNodeVisible = useMemo(() => {
    return !readOnly && renderType === 'default' && (!isDisabled || isToolNode);
  }, [readOnly, renderType, isDisabled, isToolNode]);

  const isDisableNodeVisible = !readOnly && renderType === 'default';
  const isDeleteNodeVisible = !readOnly;
  const isFocusNodeVisible = !!onFocus; // feature flag placeholder
  const isStickyNoteChangeColorVisible = !readOnly && renderType === 'n8n-nodes-base.stickyNote';

  const nodeDisabledTitle = isDisabled ? i18n.baseText('node.enable') : i18n.baseText('node.disable');

  const changeStickyColor = (color: number) => onUpdate?.({ color });

  return (
    <div
      data-test-id="canvas-node-toolbar"
      className={classes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={[styles.canvasNodeToolbarItems, itemsClass].join(' ')}>
        {isExecuteNodeVisible && (
          <N8nTooltip placement="top" disabled={!isDisabled} content={i18n.baseText('ndv.execute.deactivated')}>
            <N8nIconButton
              data-test-id="execute-node-button"
              type="tertiary"
              // @ts-ignore design-system shim supports text prop
              text
              size="small"
              icon="node-play"
              disabled={!!(isExecuting || isDisabled)}
              title={i18n.baseText('node.testStep')}
              onClick={onRun}
            />
          </N8nTooltip>
        )}

        {isDisableNodeVisible && (
          <N8nIconButton
            data-test-id="disable-node-button"
            type="tertiary"
            // @ts-ignore
            text
            size="small"
            icon="node-power"
            title={nodeDisabledTitle}
            onClick={onToggle}
          />
        )}

        {isDeleteNodeVisible && (
          <N8nIconButton
            data-test-id="delete-node-button"
            type="tertiary"
            size="small"
            // @ts-ignore
            text
            icon="node-trash"
            title={i18n.baseText('node.delete')}
            onClick={onDelete}
          />
        )}

        {isFocusNodeVisible && (
          <N8nIconButton
            type="tertiary"
            size="small"
            // @ts-ignore
            text
            icon="crosshair"
            onClick={() => nodeId && onFocus?.(nodeId)}
          />
        )}

        {isStickyNoteChangeColorVisible && (
          <div className={styles.colorPalette}>
            {[0, 1, 2, 3, 4].map((c) => (
              <div
                key={c}
                className={styles.swatch}
                style={{ background: `var(--sticky-color-${c}, #fffdc4)` }}
                onClick={() => changeStickyColor(c)}
              />
            ))}
          </div>
        )}

        <N8nIconButton
          data-test-id="overflow-node-button"
          type="tertiary"
          size="small"
          // @ts-ignore
          text
          icon="node-ellipsis"
          onClick={onOpenContextMenu}
        />
      </div>

      {showStatusIcons && (
        <div className={styles.statusIcons}>
          <CanvasNodeStatusIcons spinnerLayout="static" />
        </div>
      )}
    </div>
  );
}


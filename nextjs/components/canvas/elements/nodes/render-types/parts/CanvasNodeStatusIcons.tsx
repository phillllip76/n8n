'use client';

import React, { useMemo } from 'react';
import styles from './CanvasNodeStatusIcons.module.css';
import TitledList from '@/components/TitledList';
import { N8nTooltip, N8nIcon } from '@n8n/design-system';
import { useI18n } from '@n8n/i18n';

export const CanvasNodeDirtiness = {
  PARAMETERS_UPDATED: 'parameters-updated',
  INCOMING_CONNECTIONS_UPDATED: 'incoming-connections-updated',
  PINNED_DATA_UPDATED: 'pinned-data-updated',
  UPSTREAM_DIRTY: 'upstream-dirty',
} as const;

export type DirtinessType = (typeof CanvasNodeDirtiness)[keyof typeof CanvasNodeDirtiness];

type Props = {
  size?: 'small' | 'medium' | 'large';
  spinnerScrim?: boolean;
  spinnerLayout?: 'absolute' | 'static';
  // Derived node state inputs (to be provided by parent)
  hasPinnedData?: boolean;
  issues?: string[];
  hasIssues?: boolean;
  executionStatus?: 'unknown' | 'waiting' | 'success' | 'running' | 'error' | string;
  executionWaiting?: string | false;
  executionWaitingForNext?: boolean;
  executionRunning?: boolean;
  hasRunData?: boolean;
  runDataIterations?: number;
  isDisabled?: boolean;
  renderType?: 'default' | string;
  dirtiness?: DirtinessType | undefined;
  isExecuting?: boolean;
};

export default function CanvasNodeStatusIcons({
  size = 'large',
  spinnerScrim = false,
  spinnerLayout = 'absolute',
  hasPinnedData,
  issues = [],
  hasIssues,
  executionStatus,
  executionWaiting,
  executionWaitingForNext,
  executionRunning,
  hasRunData,
  runDataIterations = 0,
  isDisabled,
  dirtiness,
  isExecuting,
}: Props) {
  const i18n = useI18n();
  const isNodeExecuting = useMemo(() => {
    if (!isExecuting) return false;
    return Boolean(executionRunning || executionWaitingForNext || executionStatus === 'running');
  }, [isExecuting, executionRunning, executionWaitingForNext, executionStatus]);

  const commonClass = [
    styles.status,
    spinnerScrim ? styles.spinnerScrim : '',
    spinnerLayout === 'absolute' ? styles.absoluteSpinner : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (executionWaiting || executionStatus === 'waiting') {
    return (
      <div>
        <N8nTooltip content={String(executionWaiting)} placement="bottom">
          <div className={[commonClass, styles.waiting].join(' ')}>
            <N8nIcon icon="clock" size={size} />
          </div>
        </N8nTooltip>
        {spinnerLayout === 'absolute' && (
          <div className={[commonClass, styles.nodeWaitingSpinner].join(' ')}>
            <N8nIcon icon="refresh-cw" spin />
          </div>
        )}
      </div>
    );
  }

  if (isNodeExecuting) {
    return (
      <div data-test-id="canvas-node-status-running" className={[commonClass, styles.running].join(' ')}>
        <N8nIcon icon="refresh-cw" spin />
      </div>
    );
  }

  if (isDisabled) {
    return (
      <div className={[commonClass, styles.disabled].join(' ')}>
        <N8nIcon icon="power" size={size} />
      </div>
    );
  }

  if (hasIssues) {
    return (
      <N8nTooltip placement="bottom" showAfter={500} content={<TitledList title={`${i18n.baseText('node.issues')}:`} items={issues} />}>
        <div className={[commonClass, styles.issues].join(' ')} data-test-id="node-issues">
          <N8nIcon icon="node-error" size={size} />
        </div>
      </N8nTooltip>
    );
  }

  if (executionStatus === 'unknown') {
    return null; // never executed
  }

  if (hasPinnedData) {
    return (
      <div className={[commonClass, styles.pinnedData].join(' ')} data-test-id="canvas-node-status-pinned">
        <N8nIcon icon="node-pin" size={size} />
      </div>
    );
  }

  if (dirtiness !== undefined) {
    const content = dirtiness === CanvasNodeDirtiness.PARAMETERS_UPDATED ? i18n.baseText('node.dirty') : i18n.baseText('node.subjectToChange');
    return (
      <N8nTooltip placement="bottom" showAfter={500} content={content}>
        <div className={[commonClass, styles.warning].join(' ')} data-test-id="canvas-node-status-warning">
          <N8nIcon icon="node-dirty" size={size} />
          {runDataIterations > 1 && <span className={styles.count}>{runDataIterations}</span>}
        </div>
      </N8nTooltip>
    );
  }

  if (hasRunData) {
    return (
      <div className={[commonClass, styles.runData].join(' ')} data-test-id="canvas-node-status-success">
        <N8nIcon icon="node-success" size={size} />
        {runDataIterations > 1 && <span className={styles.count}>{runDataIterations}</span>}
      </div>
    );
  }

  return null;
}
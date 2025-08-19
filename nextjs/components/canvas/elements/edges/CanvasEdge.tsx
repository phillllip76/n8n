'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from 'reactflow';
import { getEdgeRenderData, NodeConnectionTypes, type NodeConnectionType } from './utils/getEdgeRenderData';
import { isValidNodeConnectionType } from '@/utils/typeGuards-react';
import CanvasEdgeToolbar from './CanvasEdgeToolbar';
import styles from './CanvasEdge.module.css';

export type CanvasConnectionPort = {
  node?: string;
  type: NodeConnectionType;
  index: number;
};

export type CanvasConnectionData = {
  source: CanvasConnectionPort;
  target: CanvasConnectionPort;
  status?: 'success' | 'error' | 'pinned' | 'running';
  maxConnections?: number;
};

export type CanvasEdgeExtraProps = {
  readOnly?: boolean;
  hovered?: boolean;
  bringToFront?: boolean;
};

export default function CanvasEdge(props: EdgeProps<CanvasConnectionData> & CanvasEdgeExtraProps) {
  const { id, data, selected, readOnly, hovered, style, markerEnd, source, target, sourceHandle, targetHandle } = props;

  const connectionType: NodeConnectionType = isValidNodeConnectionType(data.source.type)
    ? (data.source.type as NodeConnectionType)
    : NodeConnectionTypes.Main;

  const [delayedHovered, setDelayedHovered] = useState<boolean>(!!hovered);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayedHoveredTimeout = 600;

  useEffect(() => {
    if (hovered) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDelayedHovered(true);
    } else {
      timeoutRef.current = setTimeout(() => setDelayedHovered(false), delayedHoveredTimeout);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hovered]);

  const renderToolbar = (selected || delayedHovered) && !readOnly;
  const isMainConnection = data.source.type === NodeConnectionTypes.Main;
  const status = data.status;

  const edgeColor = useMemo(() => {
    if (status === 'success') return 'var(--color-success)';
    if (status === 'pinned') return 'var(--color-secondary)';
    if (!isMainConnection) return 'var(--node-type-supplemental-color)';
    if (selected) return 'var(--color-background-dark)';
    return 'var(--color-foreground-xdark)';
  }, [status, isMainConnection, selected]);

  const edgeStroke = delayedHovered ? 'var(--color-primary)' : edgeColor;
  const edgeStyle = useMemo(() => ({
    ...style,
    ...(isMainConnection ? {} : { strokeDasharray: '8,8' }),
    stroke: `var(--canvas-edge-color, ${edgeStroke})`,
    strokeWidth: 'calc(2 * var(--canvas-zoom-compensation-factor, 1))`,
    strokeLinecap: 'square',
  } as React.CSSProperties), [style, isMainConnection, edgeStroke]);

  const renderData = useMemo(() => (
    getEdgeRenderData(props as any, { connectionType })
  ), [props, connectionType]);

  const segments = renderData.segments;
  const labelPosition = renderData.labelPosition;

  const labelTransform = `translate(-50%, -50%) translate(${labelPosition[0]}px, ${labelPosition[1]}px)`;
  const edgeLabelWrapperClass = [
    'vue-flow__edge-label',
    styles.edgeLabelWrapper,
    renderData.isConnectorStraight ? styles.straight : '',
    selected ? 'selected' : '',
  ].join(' ');

  const onAdd = () => props.onClick?.({} as any); // placeholder; consumers can override
  const onDelete = () => props.onContextMenu?.({} as any);

  return (
    <>
      <g data-test-id="edge" data-source-node-name={data.source?.node} data-target-node-name={data.target?.node}>
        {/* highlight slot placeholder can be implemented by consumers */}

        {segments.map((segment, index) => (
          <BaseEdge
            id={`${id}-${index}`}
            key={segment[0]}
            className={`n8n-edge ${delayedHovered ? 'hovered' : ''} ${props.bringToFront ? 'bring-to-front' : ''}`}
            style={edgeStyle}
            path={segment[0] as unknown as string}
            markerEnd={markerEnd}
            interactionWidth={40}
          />
        ))}
      </g>

      <EdgeLabelRenderer>
        <div
          data-test-id="edge-label"
          data-source-node-name={data.source?.node}
          data-target-node-name={data.target?.node}
          data-edge-status={status}
          style={{ transform: labelTransform, ...(delayedHovered ? { zIndex: 1 } : {}) }}
          className={edgeLabelWrapperClass}
          onMouseEnter={() => {/* could emit hovered change */}}
          onMouseLeave={() => {/* could emit hovered change */}}
        >
          {renderToolbar ? (
            <CanvasEdgeToolbar
              type={connectionType}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ) : (
            <div className={styles.edgeLabel}>{props.label as any}</div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}


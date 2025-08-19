import { getBezierPath, getSmoothStepPath, Position, type EdgeProps } from 'reactflow';

export type NodeConnectionType = 'main' | string;

export const NodeConnectionTypes = {
  Main: 'main' as NodeConnectionType,
} as const;

const EDGE_PADDING_BOTTOM = 130;
const EDGE_PADDING_X = 40;
const EDGE_BORDER_RADIUS = 16;
const HANDLE_SIZE = 20;

const isRightOfSourceHandle = (sourceX: number, targetX: number) => sourceX - HANDLE_SIZE > targetX;

export function getEdgeRenderData(
  props: Pick<EdgeProps, 'sourceX' | 'sourceY' | 'sourcePosition' | 'targetX' | 'targetY' | 'targetPosition'>,
  { connectionType = NodeConnectionTypes.Main as NodeConnectionType }: { connectionType?: NodeConnectionType } = {},
) {
  const { targetX, targetY, sourceX, sourceY, sourcePosition, targetPosition } = props;
  const isConnectorStraight = sourceY === targetY;

  if (!isRightOfSourceHandle(sourceX, targetX) || connectionType !== NodeConnectionTypes.Main) {
    const segment = getBezierPath(props as any);
    return {
      segments: [segment as [string, number, number]],
      labelPosition: [segment[1] as number, segment[2] as number] as [number, number],
      isConnectorStraight,
    };
  }

  const firstSegmentTargetX = (sourceX + targetX) / 2;
  const firstSegmentTargetY = sourceY + EDGE_PADDING_BOTTOM;
  const firstSegment = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX: firstSegmentTargetX,
    targetY: firstSegmentTargetY,
    sourcePosition,
    targetPosition: Position.Right,
    borderRadius: EDGE_BORDER_RADIUS,
    offset: EDGE_PADDING_X,
  } as any);

  const secondSegment = getSmoothStepPath({
    sourceX: firstSegmentTargetX,
    sourceY: firstSegmentTargetY,
    targetX,
    targetY,
    sourcePosition: Position.Left,
    targetPosition,
    borderRadius: EDGE_BORDER_RADIUS,
    offset: EDGE_PADDING_X,
  } as any);

  return {
    segments: [firstSegment as [string, number, number], secondSegment as [string, number, number]],
    labelPosition: [firstSegmentTargetX, firstSegmentTargetY] as [number, number],
    isConnectorStraight,
  };
}


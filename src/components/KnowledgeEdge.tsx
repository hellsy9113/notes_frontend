import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export default function KnowledgeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: selected ? '#b600f8' : '#00f2ff',
        strokeWidth: selected ? 4 : 2,
        strokeLinecap: 'round',
        filter: 'drop-shadow(0 0 8px rgba(0,242,255,0.8))'
      }}
      interactionWidth={20}
    />
  );
}

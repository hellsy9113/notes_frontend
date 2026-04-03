/**
 * Summary: Custom React Flow Edge component styling the connections between knowledge nodes, particularly adding active pulsing states.
 */
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export default function KnowledgeEdge({
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
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? 'url(#active-gradient)' : '#849495',
          strokeWidth: selected ? 3 : 1.5,
          opacity: selected ? 1 : 0.3,
          transition: 'all 0.3s ease',
        }}
      />
      {/* Gradient Definition for Pulsing View */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="100%" stopColor="#b600f8" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

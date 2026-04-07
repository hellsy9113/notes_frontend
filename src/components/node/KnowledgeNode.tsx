/**
 * Main wrapper for the custom React Flow Knowledge Node.
 * Connects the modular Data and Link sections.
 */
import { Handle, Position } from '@xyflow/react';
import type { KnowledgeNodeData } from '../../types/node';
import DataSection from './DataSection';
import LinkSection from './LinkSection';

type KnowledgeNodeProps = {
  data: KnowledgeNodeData;
  selected?: boolean;
};

const C = {
  primary: '#00f2ff',
  secondary: '#b600f8',
  surfaceLow: 'rgba(28, 27, 27, 0.65)',
  outlineVariant: 'rgba(58, 73, 75, 0.15)',
};

const FONT_HEADLINE = "'Space Grotesk', sans-serif";

export default function KnowledgeNode({ data, selected }: KnowledgeNodeProps) {
  const entityId = data.entityId || 'ENTITY_0000';
  const isSmall = data.size === 'sm';

  const containerStyle = {
    width: isSmall ? 200 : 250, 
    padding: isSmall ? '18px 20px' : '22px 24px',
    borderRadius: 16,
    background: C.surfaceLow,
    border: `1px solid ${selected ? 'rgba(0,242,255,0.4)' : C.outlineVariant}`,
    boxShadow: selected 
      ? '0 0 32px rgba(0,242,255,0.15)' 
      : '0 4px 24px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
  };

  return (
    <div style={containerStyle}>
      {/* Header section (Entity ID) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isSmall ? 8 : 14 }}>
        <span style={{ fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: isSmall ? 'rgba(185,202,203,0.6)' : C.primary }}>
          {entityId}
        </span>
        {isSmall 
          ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.primary, boxShadow: `0 0 8px ${C.primary}` }} />
          : <span className="material-symbols-outlined" style={{ fontSize: 13, color: C.secondary, fontVariationSettings: "'FILL' 1" }}>hexagon</span>
        }
      </div>

      {/* Render Node Data Section */}
      {data.dataSection && (
        <DataSection data={data.dataSection} isSmall={isSmall} />
      )}

      {/* Render Node Link Section */}
      {data.linkSection && (
        <LinkSection data={data.linkSection} />
      )}

      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          width: 24, height: 8, borderRadius: 4, 
          background: C.primary, 
          border: `1px solid rgba(0, 242, 255, 0.8)`,
          boxShadow: `0 0 12px rgba(0, 242, 255, 0.8)`,
          top: -4,
          zIndex: 100,
          cursor: 'crosshair'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          width: 24, height: 8, borderRadius: 4, 
          background: C.secondary, 
          border: `1px solid rgba(182, 0, 248, 0.8)`,
          boxShadow: `0 0 12px rgba(182, 0, 248, 0.8)`,
          bottom: -4,
          zIndex: 100,
          cursor: 'crosshair'
        }} 
      />
    </div>
  );
}

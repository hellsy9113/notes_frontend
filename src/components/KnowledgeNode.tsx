/**
 * Summary: Custom React Flow Node component defining the visual representation and styles of a single knowledge entity block.
 */
import { Handle, Position } from '@xyflow/react';

type KnowledgeNodeProps = {
  data: Record<string, unknown>;
  selected?: boolean;
};

const C = {
  primary: '#00f2ff',
  secondary: '#b600f8',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#b9cacb',
  surfaceLow: 'rgba(28, 27, 27, 0.65)',
  outlineVariant: 'rgba(58, 73, 75, 0.15)',
};

const FONT_HEADLINE = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

export default function KnowledgeNode({ data, selected }: KnowledgeNodeProps) {
  const label = data.label as string;
  const description = data.description as string;
  const entityId = data.entityId as string || 'ENTITY_0000';
  const tags = (data.tags as string[]) || [];
  const isSmall = data.size === 'sm';

  if (isSmall) {
    return (
      <div style={{
        width: 200, padding: '18px 20px',
        borderRadius: 16,
        background: C.surfaceLow,
        border: `1px solid ${selected ? 'rgba(0,242,255,0.35)' : C.outlineVariant}`,
        boxShadow: selected ? '0 0 48px rgba(0,242,255,0.12)' : 'none',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(185,202,203,0.6)' }}>{entityId}</span>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.primary, boxShadow: `0 0 8px ${C.primary}` }} />
        </div>
        <h4 style={{ fontFamily: FONT_HEADLINE, fontSize: 13, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{label}</h4>
        <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: C.onSurfaceVariant, lineHeight: 1.5, margin: 0 }}>{description}</p>
        <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 8, height: 8 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 8, height: 8 }} />
      </div>
    );
  }

  return (
    <div style={{
      width: 240, padding: '22px 24px',
      borderRadius: 16,
      background: C.surfaceLow,
      border: selected ? `1.5px solid rgba(0,242,255,0.5)` : `1px solid ${C.outlineVariant}`,
      boxShadow: selected
        ? '0 0 48px rgba(0,242,255,0.15), 0 0 0 1px rgba(0,242,255,0.1)'
        : '0 4px 24px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      transition: 'all 0.3s ease',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.primary }}>{entityId}</span>
        <span className="material-symbols-outlined" style={{ fontSize: 13, color: C.secondary, fontVariationSettings: "'FILL' 1" }}>hexagon</span>
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>{label}</h3>

      {/* Description */}
      <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.onSurfaceVariant, lineHeight: 1.6, margin: '0 0 14px' }}>{description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              padding: '2px 8px', borderRadius: 9999, fontSize: 9,
              fontFamily: FONT_HEADLINE, letterSpacing: '0.05em',
              background: i === 0 ? 'rgba(182,0,248,0.1)' : 'rgba(0,242,255,0.1)',
              color: i === 0 ? '#ebb2ff' : C.primary,
              border: `1px solid ${i === 0 ? 'rgba(182,0,248,0.25)' : 'rgba(0,242,255,0.25)'}`,
            }}>{tag}</span>
          ))}
        </div>
      )}

      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 8, height: 8 }} />
    </div>
  );
}

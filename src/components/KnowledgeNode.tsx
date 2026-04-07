/**
 * Summary: Custom React Flow Node. Double-clicking opens the editor for this node.
 * Displays live-synced label and description from the editor store.
 */
import { Handle, Position } from '@xyflow/react';
import { useEditorStore } from '../store/useEditorStore';
import { useGraphStore } from '../store/useGraphStore';

type KnowledgeNodeProps = {
  id: string;
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

export default function KnowledgeNode({ id, data, selected }: KnowledgeNodeProps) {
  const { openEditorForNode, editors } = useEditorStore();
  const { updateNodeData } = useGraphStore();

  // Check if this node has an open editor tab — use its content if so
  const editorTab = editors.find((e) => e.nodeId === id);

  // Prefer live editor content, fall back to node data
  const label = (editorTab?.title ?? data.label) as string;
  const description = (editorTab?.content ?? data.description) as string;
  const entityId = (data.entityId as string) || 'ENTITY_0000';
  const tags = (data.tags as string[]) || [];
  const isSmall = data.size === 'sm';

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditorForNode(id, label, description);
  };

  // Check if this node's editor is currently active and open
  const { activeEditorId, isEditorOpen } = useEditorStore();
  const isBeingEdited = isEditorOpen && activeEditorId === id;

  if (isSmall) {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        title="Double-click to edit"
        style={{
          width: 200, padding: '18px 20px',
          borderRadius: 16,
          background: C.surfaceLow,
          border: `1px solid ${
            isBeingEdited
              ? 'rgba(182,0,248,0.5)'
              : selected
              ? 'rgba(0,242,255,0.35)'
              : C.outlineVariant
          }`,
          boxShadow: isBeingEdited
            ? '0 0 32px rgba(182,0,248,0.15)'
            : selected
            ? '0 0 48px rgba(0,242,255,0.12)'
            : 'none',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
          cursor: 'grab',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(185,202,203,0.6)' }}>{entityId}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isBeingEdited && (
              <span style={{ fontFamily: FONT_HEADLINE, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d966ff' }}>editing</span>
            )}
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isBeingEdited ? '#d966ff' : C.primary, boxShadow: `0 0 8px ${isBeingEdited ? '#d966ff' : C.primary}` }} />
          </div>
        </div>
        <h4 style={{ fontFamily: FONT_HEADLINE, fontSize: 13, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{label}</h4>
        <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: C.onSurfaceVariant, lineHeight: 1.5, margin: 0 }}>
          {description || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Double-click to add notes…</span>}
        </p>
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ 
            background: C.primary, width: 24, height: 8, borderRadius: 4, 
            border: '1px solid rgba(0,242,255,0.5)', zIndex: 100, cursor: 'crosshair',
            boxShadow: '0 0 12px rgba(0,242,255,0.5)'
          }} 
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ 
            background: C.secondary, width: 24, height: 8, borderRadius: 4, 
            border: '1px solid rgba(182,0,248,0.5)', zIndex: 100, cursor: 'crosshair',
            boxShadow: '0 0 12px rgba(182,0,248,0.5)'
          }} 
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
      style={{
        width: 240, padding: '22px 24px',
        borderRadius: 16,
        background: C.surfaceLow,
        border: isBeingEdited
          ? '1.5px solid rgba(182,0,248,0.5)'
          : selected
          ? '1.5px solid rgba(0,242,255,0.5)'
          : `1px solid ${C.outlineVariant}`,
        boxShadow: isBeingEdited
          ? '0 0 40px rgba(182,0,248,0.18), 0 0 0 1px rgba(182,0,248,0.1)'
          : selected
          ? '0 0 48px rgba(0,242,255,0.15), 0 0 0 1px rgba(0,242,255,0.1)'
          : '0 4px 24px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
        cursor: 'grab',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.primary }}>{entityId}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isBeingEdited && (
            <span style={{
              fontFamily: FONT_HEADLINE, fontSize: 8, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#d966ff',
              padding: '1px 6px', borderRadius: 4,
              background: 'rgba(182,0,248,0.1)',
              border: '1px solid rgba(182,0,248,0.25)',
            }}>
              editing
            </span>
          )}
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 13, color: isBeingEdited ? '#d966ff' : C.secondary, fontVariationSettings: "'FILL' 1" }}
          >
            hexagon
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>
        {label}
      </h3>

      {/* Description — truncated preview */}
      <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.onSurfaceVariant, lineHeight: 1.6, margin: '0 0 14px' }}>
        {description
          ? description.length > 120
            ? description.slice(0, 120) + '…'
            : description
          : <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Double-click to add notes…</span>
        }
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
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

      {/* Edit hint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        opacity: 0.3, marginTop: 2,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 11, color: C.onSurfaceVariant }}>edit</span>
        <span style={{ fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.onSurfaceVariant }}>
          double-click to edit
        </span>
      </div>

      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: C.primary, width: 24, height: 8, borderRadius: 4, 
          border: '1px solid rgba(0,242,255,0.5)', zIndex: 100, cursor: 'crosshair',
          boxShadow: '0 0 12px rgba(0,242,255,0.5)'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: C.secondary, width: 24, height: 8, borderRadius: 4, 
          border: '1px solid rgba(182,0,248,0.5)', zIndex: 100, cursor: 'crosshair',
          boxShadow: '0 0 12px rgba(182,0,248,0.5)'
        }} 
      />
    </div>
  );
}
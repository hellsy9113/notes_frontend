/**
 * Summary: Bottom taskbar tracking all open node editors.
 * Each tab corresponds to a graph node. Tabs show node label, allow switching and closing.
 */
import { useEditorStore } from '../store/useEditorStore';

const C = {
  primary: '#00f2ff',
  secondary: '#b600f8',
  surface: 'rgba(10,10,10,0.88)',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#8a9a9b',
  border: 'rgba(0,242,255,0.1)',
  borderActive: 'rgba(0,242,255,0.35)',
};

const FONT_HEADLINE = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function EditorTaskbar() {
  const {
    editors,
    activeEditorId,
    isEditorOpen,
    closeEditor,
    setActiveEditor,
    minimizeEditor,
  } = useEditorStore();

  const totalOpen = editors.length;

  if (totalOpen === 0) {
    // Render a minimal bar with a hint
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
        height: 36,
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 8,
        background: 'rgba(10,10,10,0.7)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'rgba(185,202,203,0.25)' }}>edit_note</span>
        <span style={{
          fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(185,202,203,0.25)',
        }}>
          Double-click any node to open its editor
        </span>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
      height: 44,
      display: 'flex', alignItems: 'center',
      gap: 0,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
      fontFamily: FONT_BODY,
      paddingLeft: 8, paddingRight: 8,
    }}>
      {/* ── System label ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 14px',
        borderRight: `1px solid ${C.border}`,
        marginRight: 8, flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.secondary, opacity: 0.8, fontVariationSettings: "'FILL' 1" }}>
          hub
        </span>
        <span style={{
          fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: C.onSurfaceVariant,
        }}>
          Node Editors
        </span>
        {/* Count badge */}
        <div style={{
          minWidth: 18, height: 18, borderRadius: 9,
          background: 'rgba(0,242,255,0.15)',
          border: `1px solid ${C.borderActive}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 5px',
        }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.primary, fontWeight: 600 }}>
            {totalOpen}
          </span>
        </div>
      </div>

      {/* ── Editor tabs ────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 3, flex: 1,
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', alignItems: 'center',
        padding: '0 4px',
      }}>
        {editors.map((ed) => {
          const isActive = ed.id === activeEditorId;
          const isVisible = isEditorOpen && isActive;

          return (
            <div
              key={ed.id}
              onClick={() => setActiveEditor(ed.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 10px 0 10px',
                height: 32, borderRadius: 8,
                cursor: 'pointer', flexShrink: 0,
                maxWidth: 220, minWidth: 110,
                background: isActive
                  ? isVisible ? 'rgba(0,242,255,0.1)' : 'rgba(0,242,255,0.05)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? C.borderActive : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isActive && isVisible ? '0 0 16px rgba(0,242,255,0.1)' : 'none',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }
              }}
            >
              {/* Node icon */}
              <span className="material-symbols-outlined" style={{
                fontSize: 12, flexShrink: 0,
                color: isVisible ? C.secondary : 'rgba(182,0,248,0.35)',
                fontVariationSettings: "'FILL' 1",
                transition: 'color 0.2s',
              }}>hexagon</span>

              {/* Active dot */}
              <div style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                background: isVisible ? C.primary : isActive ? 'rgba(0,242,255,0.35)' : 'rgba(255,255,255,0.15)',
                boxShadow: isVisible ? `0 0 6px ${C.primary}` : 'none',
                transition: 'all 0.2s',
              }} />

              {/* Title */}
              <span style={{
                fontFamily: FONT_BODY, fontSize: 12,
                color: isActive ? C.onSurface : C.onSurfaceVariant,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                flex: 1, transition: 'color 0.15s',
              }}>
                {truncate(ed.title || 'Untitled', 18)}
              </span>

              {/* Close */}
              <button
                onClick={(e) => { e.stopPropagation(); closeEditor(ed.id); }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(185,202,203,0.25)', padding: 2, borderRadius: 4,
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff5555')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(185,202,203,0.25)')}
                title={`Close "${ed.title || 'Untitled'}"`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Right controls ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        paddingLeft: 8, borderLeft: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        {/* Minimize / restore toggle */}
        <button
          onClick={isEditorOpen ? minimizeEditor : () => setActiveEditor(activeEditorId ?? editors[0]?.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: isEditorOpen ? 'rgba(182,0,248,0.1)' : 'rgba(0,242,255,0.07)',
            border: `1px solid ${isEditorOpen ? 'rgba(182,0,248,0.3)' : 'rgba(0,242,255,0.2)'}`,
            cursor: 'pointer',
            color: isEditorOpen ? '#d966ff' : C.primary,
            padding: '4px 12px', borderRadius: 7,
            fontFamily: FONT_HEADLINE, fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.18s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = isEditorOpen ? 'rgba(182,0,248,0.18)' : 'rgba(0,242,255,0.14)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isEditorOpen ? 'rgba(182,0,248,0.1)' : 'rgba(0,242,255,0.07)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            {isEditorOpen ? 'minimize' : 'open_in_full'}
          </span>
          <span>{isEditorOpen ? 'Minimize' : 'Restore'}</span>
        </button>
      </div>
    </div>
  );
}
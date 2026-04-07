/**
 * Summary: Full-screen editor overlay. Content and title edits are synced
 * back to the corresponding graph node in real time via useGraphStore.updateNodeData.
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useGraphStore } from '../store/useGraphStore';

const C = {
  primary: '#00f2ff',
  secondary: '#b600f8',
  surface: '#0d0d0d',
  surfaceMid: '#111111',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#8a9a9b',
  border: 'rgba(0,242,255,0.12)',
  borderHover: 'rgba(0,242,255,0.3)',
};

const FONT_HEADLINE = "'Space Grotesk', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";
const FONT_BODY = "'Inter', system-ui, sans-serif";

function formatDate(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function wordCount(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function EditorWindow() {
  const {
    editors,
    activeEditorId,
    isEditorOpen,
    updateContent,
    updateTitle,
    minimizeEditor,
    closeEditor,
    setActiveEditor,
  } = useEditorStore();

  const { updateNodeData } = useGraphStore();

  const activeEditor = editors.find((e) => e.id === activeEditorId) ?? null;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  useEffect(() => {
    if (isEditorOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [isEditorOpen, activeEditorId]);

  // Sync content → graph node
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!activeEditorId || !activeEditor) return;
      const content = e.target.value;
      updateContent(activeEditorId, content);
      // Sync description back to the node
      updateNodeData(activeEditor.nodeId, { description: content });
    },
    [activeEditorId, activeEditor, updateContent, updateNodeData]
  );

  // Sync title → graph node
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeEditorId || !activeEditor) return;
      const title = e.target.value;
      updateTitle(activeEditorId, title);
      updateNodeData(activeEditor.nodeId, { label: title });
    },
    [activeEditorId, activeEditor, updateTitle, updateNodeData]
  );

  const handleTitleBlur = useCallback(() => {
    setIsTitleEditing(false);
    if (activeEditorId && activeEditor) {
      const finalTitle = activeEditor.title.trim() || 'Untitled';
      updateTitle(activeEditorId, finalTitle);
      updateNodeData(activeEditor.nodeId, { label: finalTitle });
    }
  }, [activeEditorId, activeEditor, updateTitle, updateNodeData]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditorOpen) minimizeEditor();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditorOpen, minimizeEditor]);

  if (!isEditorOpen || !activeEditor) return null;

  const words = wordCount(activeEditor.content);
  const chars = activeEditor.content.length;
  const lines = activeEditor.content === '' ? 1 : activeEditor.content.split('\n').length;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      background: C.surface, fontFamily: FONT_BODY,
    }}>
      {/* Accent lines */}
      <div style={{
        position: 'absolute', top: 0, left: '30%', width: 600, height: 2,
        background: `linear-gradient(90deg, transparent, ${C.primary}, transparent)`,
        opacity: 0.6, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 0, right: '20%', width: 300, height: 2,
        background: `linear-gradient(90deg, transparent, ${C.secondary}, transparent)`,
        opacity: 0.4, pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Title Bar ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 52,
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(13,13,13,0.98)', flexShrink: 0,
      }}>
        {/* Window dots */}
        <div style={{ display: 'flex', gap: 7, marginRight: 8 }}>
          {[C.secondary, '#f5a623', C.primary].map((color, i) => (
            <button key={i}
              onClick={i === 0 ? () => closeEditor(activeEditor.id) : i === 1 ? minimizeEditor : undefined}
              title={['Close', 'Minimize', 'Fullscreen'][i]}
              style={{
                width: 12, height: 12, borderRadius: '50%',
                background: color, border: 'none', cursor: 'pointer',
                opacity: 0.85, boxShadow: `0 0 8px ${color}55`, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
            />
          ))}
        </div>

        {/* Tab strip */}
        <div style={{
          display: 'flex', gap: 2, flex: 1,
          overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none',
        }}>
          {editors.map((ed) => {
            const isActive = ed.id === activeEditorId;
            return (
              <div key={ed.id} onClick={() => setActiveEditor(ed.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0 12px', height: 36, borderRadius: '8px 8px 0 0',
                cursor: 'pointer', flexShrink: 0, maxWidth: 200,
                background: isActive ? C.surfaceMid : 'transparent',
                borderBottom: isActive ? `2px solid ${C.primary}` : '2px solid transparent',
                transition: 'all 0.18s',
              }}>
                {/* Node indicator */}
                <span className="material-symbols-outlined" style={{
                  fontSize: 12,
                  color: isActive ? C.secondary : 'rgba(182,0,248,0.4)',
                  fontVariationSettings: "'FILL' 1",
                }}>
                  hexagon
                </span>
                <span style={{
                  fontFamily: FONT_BODY, fontSize: 12,
                  color: isActive ? C.onSurface : C.onSurfaceVariant,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: 120,
                }}>
                  {ed.title || 'Untitled'}
                </span>
                <button onClick={(e) => { e.stopPropagation(); closeEditor(ed.id); }} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: C.onSurfaceVariant, padding: 2, borderRadius: 4,
                  display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff4d4d')}
                  onMouseLeave={e => (e.currentTarget.style.color = C.onSurfaceVariant)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
          <span style={{
            fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: C.primary, opacity: 0.6,
          }}>NODE_EDITOR</span>
          <button onClick={minimizeEditor} title="Minimize (Esc)" style={{
            background: 'rgba(0,242,255,0.06)', border: `1px solid ${C.border}`,
            cursor: 'pointer', color: C.onSurfaceVariant,
            padding: '4px 10px', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: FONT_HEADLINE, fontSize: 10, letterSpacing: '0.1em',
            transition: 'all 0.18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.12)'; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.06)'; e.currentTarget.style.color = C.onSurfaceVariant; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>minimize</span>
            <span>ESC</span>
          </button>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 20px',
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(11,11,11,0.9)', flexShrink: 0,
      }}>
        {/* Node label / editable title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.secondary, fontVariationSettings: "'FILL' 1" }}>
            hexagon
          </span>
          <input
            value={activeEditor.title}
            onChange={handleTitleChange}
            onFocus={() => setIsTitleEditing(true)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Node label…"
            style={{
              background: isTitleEditing ? 'rgba(0,242,255,0.06)' : 'transparent',
              border: isTitleEditing ? `1px solid ${C.borderHover}` : '1px solid transparent',
              color: C.onSurface,
              fontFamily: FONT_HEADLINE, fontSize: 13, fontWeight: 600,
              padding: '2px 8px', borderRadius: 4,
              outline: 'none', width: 200, transition: 'all 0.18s',
              cursor: isTitleEditing ? 'text' : 'pointer',
            }}
          />
          <span style={{
            fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: C.primary, opacity: 0.5,
            padding: '1px 6px', borderRadius: 4,
            background: 'rgba(0,242,255,0.05)',
            border: '1px solid rgba(0,242,255,0.1)',
          }}>
            synced to node
          </span>
        </div>

        <div style={{ width: 1, height: 18, background: C.border, margin: '0 8px' }} />

        {/* Toolbar actions */}
        {[
          { icon: 'format_bold', label: 'Bold' },
          { icon: 'format_italic', label: 'Italic' },
          { icon: 'format_underlined', label: 'Underline' },
          { icon: 'format_list_bulleted', label: 'Bullet List' },
          { icon: 'format_list_numbered', label: 'Numbered List' },
          { icon: 'code', label: 'Code Block' },
          { icon: 'link', label: 'Link' },
        ].map(({ icon, label }) => (
          <button key={icon} title={label} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: C.onSurfaceVariant, padding: '4px 8px', borderRadius: 5,
            display: 'flex', alignItems: 'center', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.08)'; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{icon}</span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.onSurfaceVariant, opacity: 0.6 }}>
            Saved {formatDate(activeEditor.lastModified)}
          </span>
        </div>
      </div>

      {/* ── Editor Body ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Line numbers */}
        <div style={{
          width: 52, flexShrink: 0,
          background: 'rgba(10,10,10,0.6)',
          borderRight: `1px solid ${C.border}`,
          padding: '28px 0',
          overflowY: 'hidden', userSelect: 'none',
          display: 'flex', flexDirection: 'column',
        }}>
          {Array.from({ length: Math.max(lines, 40) }).map((_, i) => (
            <div key={i} style={{
              height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: 12,
              fontFamily: FONT_MONO, fontSize: 11,
              color: i < lines ? 'rgba(0,242,255,0.3)' : 'rgba(255,255,255,0.07)',
            }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,242,255,0.018) 28px)',
          }} />
          <textarea
            ref={textareaRef}
            value={activeEditor.content}
            onChange={handleContentChange}
            placeholder={`Write notes for this node...\n\nThis text is live-synced to the node's description on the canvas.`}
            spellCheck={false}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              color: C.onSurface, fontFamily: FONT_MONO,
              fontSize: 15, lineHeight: '28px',
              padding: '28px 60px 28px 24px',
              caretColor: C.primary, zIndex: 2,
              scrollbarWidth: 'thin',
              scrollbarColor: `rgba(0,242,255,0.2) transparent`,
            } as React.CSSProperties}
          />
        </div>

        {/* Stats sidebar */}
        <div style={{
          width: 200, flexShrink: 0,
          borderLeft: `1px solid ${C.border}`,
          background: 'rgba(10,10,10,0.5)',
          padding: 20,
          display: 'flex', flexDirection: 'column', gap: 20,
          overflowY: 'auto',
        }}>
          {/* Node info */}
          <div>
            <div style={{
              fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: C.secondary, marginBottom: 10, opacity: 0.8,
            }}>Node</div>
            <div style={{
              padding: '8px 10px', borderRadius: 8,
              background: 'rgba(182,0,248,0.06)',
              border: '1px solid rgba(182,0,248,0.15)',
            }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.onSurface, marginBottom: 2 }}>
                {activeEditor.title || 'Untitled'}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.onSurfaceVariant, opacity: 0.6 }}>
                {activeEditor.nodeId.slice(0, 16)}…
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: C.border }} />

          {/* Stats */}
          <div>
            <div style={{
              fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: C.primary, marginBottom: 12, opacity: 0.8,
            }}>Stats</div>
            {[
              { label: 'Words', value: words.toLocaleString() },
              { label: 'Characters', value: chars.toLocaleString() },
              { label: 'Lines', value: lines.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 10,
              }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.onSurfaceVariant }}>{label}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.onSurface, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: C.border }} />

          {/* Open node editors list */}
          <div>
            <div style={{
              fontFamily: FONT_HEADLINE, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: C.primary, marginBottom: 12, opacity: 0.8,
            }}>Open Nodes</div>
            {editors.map((ed) => (
              <div key={ed.id} onClick={() => setActiveEditor(ed.id)} style={{
                padding: '6px 8px', borderRadius: 6, marginBottom: 4,
                cursor: 'pointer',
                background: ed.id === activeEditorId ? 'rgba(0,242,255,0.08)' : 'transparent',
                border: `1px solid ${ed.id === activeEditorId ? C.border : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 11,
                  color: ed.id === activeEditorId ? C.primary : C.onSurfaceVariant,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {ed.title || 'Untitled'}
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: 'rgba(185,202,203,0.4)', marginTop: 2 }}>
                  {wordCount(ed.content)} words
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: 'rgba(185,202,203,0.3)', lineHeight: 1.8 }}>
              <div>ESC — minimize</div>
              <div>Title edits → node label</div>
              <div>Text → node description</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Bar ─────────────────────────────────────────────────── */}
      <div style={{
        height: 28, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 20,
        borderTop: `1px solid ${C.border}`,
        background: 'rgba(8,8,8,0.95)',
      }}>
        {[
          { label: 'NODE NOTES', icon: 'hub' },
          { label: `LN ${lines}`, icon: null },
          { label: 'LIVE SYNC', icon: 'sync' },
          { label: 'NEURAL OS v2.1', icon: 'terminal' },
        ].map(({ label, icon }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {icon && (
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: C.primary, opacity: 0.6 }}>{icon}</span>
            )}
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(185,202,203,0.4)', letterSpacing: '0.08em' }}>
              {label}
            </span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: C.primary, boxShadow: `0 0 8px ${C.primary}`,
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(0,242,255,0.5)', letterSpacing: '0.1em' }}>
            SYNCED
          </span>
        </div>
      </div>
    </div>
  );
}
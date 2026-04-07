import { useEffect, useRef } from 'react';

const C = {
  surface: '#131313',
  surfaceLow: 'rgba(28, 27, 27, 0.95)',
  primary: '#00f2ff',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#b9cacb',
  outlineVariant: 'rgba(58, 73, 75, 0.3)',
};

const FONT = "'Inter', system-ui, sans-serif";

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
}

export default function ContextMenu({ isOpen, x, y, onClose, onEdit }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 100,
        background: C.surfaceLow,
        border: `1px solid ${C.outlineVariant}`,
        borderRadius: 12,
        padding: 8,
        minWidth: 160,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        fontFamily: FONT,
      }}
    >
      <button
        onClick={() => { onEdit(); onClose(); }}
        style={{
          width: '100%', textAlign: 'left', padding: '8px 12px',
          background: 'transparent', border: 'none', color: '#fff',
          cursor: 'pointer', borderRadius: 6, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,242,255,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.primary }}>edit</span>
        Edit Knowledge Component
      </button>

      <div style={{ height: 1, background: C.outlineVariant, margin: '4px 0' }} />

      {['Connect Component', 'Duplicate', 'Archive Node'].map(label => (
        <button
          key={label}
          onClick={onClose}
          style={{
            width: '100%', textAlign: 'left', padding: '8px 12px',
            background: 'transparent', border: 'none', color: C.onSurfaceVariant,
            cursor: 'not-allowed', borderRadius: 6, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{label === 'Archive Node' ? 'delete' : 'category'}</span>
          {label} (WIP)
        </button>
      ))}
    </div>
  );
}

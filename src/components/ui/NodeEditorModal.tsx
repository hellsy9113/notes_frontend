import { useState, useEffect } from 'react';
import type { KnowledgeNodeData } from '../../types/node';

const C = {
  surfaceLow: 'rgba(28, 27, 27, 0.98)',
  primary: '#00f2ff',
  secondary: '#b600f8',
  onSurfaceVariant: '#b9cacb',
  outlineVariant: 'rgba(58, 73, 75, 0.5)',
};

const FONT_HEADLINE = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

interface NodeEditorModalProps {
  isOpen: boolean;
  node: { id: string; data: KnowledgeNodeData } | null;
  onClose: () => void;
  onSave: (id: string, updatedData: any) => void;
}

export default function NodeEditorModal({ isOpen, node, onClose, onSave }: NodeEditorModalProps) {
  const [topic, setTopic] = useState('');
  const [heading, setHeading] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (isOpen && node && node.data.dataSection) {
      setTopic(node.data.dataSection.actualData?.topic || '');
      setHeading(node.data.dataSection.actualData?.heading || '');
      setParagraph(node.data.dataSection.actualData?.paragraph || '');
      setSummary(node.data.dataSection.summary || '');
    }
  }, [isOpen, node]);

  if (!isOpen || !node) return null;

  const handleSave = () => {
    const updatedDataSection = {
      ...node.data.dataSection,
      summary,
      actualData: {
        topic,
        heading,
        paragraph,
      }
    };

    onSave(node.id, { dataSection: updatedDataSection });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: 600, maxWidth: '90vw',
        background: C.surfaceLow,
        border: `1px solid rgba(0,242,255,0.3)`,
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,242,255,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: FONT_HEADLINE, color: '#fff', fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Edit Neural Component</h2>
            <span style={{ fontFamily: FONT_HEADLINE, fontSize: 10, color: C.onSurfaceVariant, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {node.data.entityId}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: C.onSurfaceVariant, cursor: 'pointer' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontFamily: FONT_HEADLINE, fontSize: 11, color: C.primary, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.1em' }}>Topic</label>
            <input
              value={topic} onChange={(e) => setTopic(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(14,14,14,0.5)', border: `1px solid ${C.outlineVariant}`, borderRadius: 8, color: '#fff', fontFamily: FONT_BODY, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: FONT_HEADLINE, fontSize: 11, color: C.primary, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.1em' }}>Heading</label>
            <input
              value={heading} onChange={(e) => setHeading(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(14,14,14,0.5)', border: `1px solid ${C.outlineVariant}`, borderRadius: 8, color: '#fff', fontFamily: FONT_BODY, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: FONT_HEADLINE, fontSize: 11, color: C.primary, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.1em' }}>Detailed Paragraph</label>
            <textarea
              value={paragraph} onChange={(e) => setParagraph(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(14,14,14,0.5)', border: `1px solid ${C.outlineVariant}`, borderRadius: 8, color: '#fff', fontFamily: FONT_BODY, outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: FONT_HEADLINE, fontSize: 11, color: C.secondary, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.1em' }}>Node Summary</label>
            <textarea
              value={summary} onChange={(e) => setSummary(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(14,14,14,0.5)', border: `1px solid ${C.outlineVariant}`, borderRadius: 8, color: '#fff', fontFamily: FONT_BODY, outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, background: 'transparent', border: `1px solid ${C.outlineVariant}`, color: C.onSurfaceVariant, cursor: 'pointer', fontFamily: FONT_HEADLINE, fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: 8, background: C.primary, border: 'none', color: '#00363a', cursor: 'pointer', fontFamily: FONT_HEADLINE, fontWeight: 700, letterSpacing: '0.05em' }}>Save Modifications</button>
        </div>
      </div>
    </div>
  );
}

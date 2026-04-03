/**
 * Summary: Core React Flow canvas component that orchestrates node rendering, graph interactions,
 * and global UI overlays. The graph-paper background is rendered as the base canvas layer
 * inside React Flow so it pans/zooms infinitely with the graph.
 * A "Reset View" button snaps the viewport back to the origin (0,0) at zoom 1.
 */
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import type { NodeTypes, EdgeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '../store/useGraphStore';
import { useCallback, useRef } from 'react';
import KnowledgeNode from './KnowledgeNode';
import KnowledgeEdge from './KnowledgeEdge';

const nodeTypes: NodeTypes = { knowledgeNode: KnowledgeNode };
const edgeTypes: EdgeTypes = { knowledgeEdge: KnowledgeEdge };

let nodeCount = 0;

// ─── Design Tokens ────────────────────────────────────────────────────
const C = {
  primary: '#00f2ff',
  primaryDim: '#00dbe7',
  secondary: '#b600f8',
  surface: '#131313',
  surfaceLow: 'rgba(28, 27, 27, 0.6)',
  surfaceLowest: 'rgba(14, 14, 14, 0.8)',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#b9cacb',
  outlineVariant: 'rgba(58, 73, 75, 0.15)',
  navBg: 'rgba(19, 19, 19, 0.7)',
};

const FONT_HEADLINE = "'Space Grotesk', sans-serif";
// ────────────────────────────────────────────────────────────────────────

export default function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useGraphStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // useReactFlow gives us programmatic control over the viewport
  const { zoomIn, zoomOut, setViewport, fitView } = useReactFlow();

  const addNewNode = useCallback(() => {
    nodeCount++;
    const id = `node-${Date.now()}`;
    addNode({
      id,
      position: { x: 150 + Math.random() * 500, y: 150 + Math.random() * 350 },
      data: {
        entityId: `ENTITY_${String(nodeCount).padStart(4, '0')}`,
        label: 'New Concept',
        description: 'Synchronizing thought into the neural nexus...',
        tags: ['Active'],
      },
      type: 'knowledgeNode',
    });
  }, [addNode]);

  // ── Viewport controls ─────────────────────────────────────────────────
  const handleZoomIn    = useCallback(() => zoomIn({ duration: 250 }), [zoomIn]);
  const handleZoomOut   = useCallback(() => zoomOut({ duration: 250 }), [zoomOut]);
  const handleResetView = useCallback(() =>
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 500 }), [setViewport]);
  const handleFitView   = useCallback(() =>
    fitView({ duration: 500, padding: 0.15 }), [fitView]);

  const navControls = [
    { icon: 'add',         label: 'Zoom In',     handler: handleZoomIn },
    { icon: 'remove',      label: 'Zoom Out',    handler: handleZoomOut },
    { icon: 'restart_alt', label: 'Origin',      handler: handleResetView },
    { icon: 'fullscreen',  label: 'Fit Screen',  handler: handleFitView },
  ];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: C.surface }}>

      {/* ── Ambient Glows (viewport-fixed decorative blobs) ─────────── */}
      <div style={{
        position: 'fixed', top: '20%', left: '20%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,242,255,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '25%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(182,0,248,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Navigation Bar ──────────────────────────────────────────── */}
      <header className="glass" style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 24px',
        width: 'calc(100% - 64px)', maxWidth: 960,
        borderRadius: 9999,
        background: C.navBg,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 0 20px rgba(0,242,255,0.12)',
      }}>
        {/* Brand + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em', color: C.primary, textTransform: 'uppercase' }}>
            NEURAL_NEXUS
          </span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, fontSize: 16, color: C.onSurfaceVariant }}>search</span>
            <input
              placeholder="Search coordinates..."
              style={{
                background: 'rgba(28,27,27,0.5)', border: 'none',
                outline: 'none', color: '#fff', fontSize: 12,
                width: 240, padding: '7px 14px 7px 34px',
                borderRadius: 9999,
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {['Graph', 'Insights', 'Archive'].map((link, i) => (
            <a key={link} href="#" style={{
              fontFamily: FONT_HEADLINE, fontSize: 10, fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: i === 0 ? C.primary : C.onSurfaceVariant,
              padding: '4px 12px', borderRadius: 9999, textDecoration: 'none',
              background: i === 0 ? 'rgba(0,242,255,0.08)' : 'transparent',
              transition: 'all 0.2s',
            }}>{link}</a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={addNewNode} style={{
            background: C.primary, color: '#00363a',
            border: 'none', cursor: 'pointer',
            padding: '6px 16px', borderRadius: 9999,
            fontFamily: FONT_HEADLINE, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: '0 0 16px rgba(0,242,255,0.2)',
            transition: 'all 0.2s',
          }}>
            Add Node
          </button>
          {['settings', 'account_circle'].map(icon => (
            <button key={icon} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: '50%', color: C.onSurfaceVariant }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Ambient Title + Breadcrumb ───────────────────────────────── */}
      <div style={{ position: 'fixed', top: 96, left: 40, zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{
          fontFamily: FONT_HEADLINE, fontSize: '6rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.04em',
          textTransform: 'uppercase', lineHeight: 1, userSelect: 'none',
          marginLeft: -4,
        }}>ARCHITECTURE</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, marginLeft: 4, pointerEvents: 'auto' }}>
          {['ROOT', 'PROJECT_NEURAL', 'KNOWLEDGE_GRAPH'].map((crumb, i) => (
            <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span className="material-symbols-outlined" style={{ fontSize: 10, color: 'rgba(185,202,203,0.3)' }}>chevron_right</span>}
              <span style={{
                fontFamily: FONT_HEADLINE, fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', cursor: 'pointer',
                color: i === 2 ? C.primary : 'rgba(185,202,203,0.35)',
              }}>{crumb}</span>
            </span>
          ))}
        </div>
      </div>



      {/* ── Navigation Rail (Bottom Right) — all buttons now functional ── */}
      <aside className="glass" style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 50,
        display: 'flex', flexDirection: 'column', gap: 4, padding: 8,
        borderRadius: 20, background: 'rgba(14,14,14,0.7)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 0 24px rgba(0,242,255,0.08)',
        fontFamily: FONT_HEADLINE,
      }}>
        <div style={{ padding: '4px 8px 6px', borderBottom: '1px solid rgba(58,73,75,0.15)', marginBottom: 2 }}>
          <span style={{ display: 'block', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary }}>Navigation</span>
          <span style={{ display: 'block', fontSize: 8, opacity: 0.4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Spatial Coords</span>
        </div>
        {navControls.map(({ icon, label, handler }) => (
          <button
            key={label}
            onClick={handler}
            title={label}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '10px 14px', gap: 3, border: 'none', cursor: 'pointer',
              borderRadius: 12, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: FONT_HEADLINE, transition: 'all 0.2s',
              background: icon === 'restart_alt' ? 'rgba(0,242,255,0.12)' : 'transparent',
              color: icon === 'restart_alt' ? C.primary : C.onSurfaceVariant,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </aside>

      {/* ── Mini-map Portal (Bottom Left) ────────────────────────────── */}
      <div className="glass" style={{
        position: 'fixed', bottom: 32, left: 32, zIndex: 20,
        width: 180, height: 180, borderRadius: 20,
        background: 'rgba(14,14,14,0.65)',
        border: `1px solid ${C.outlineVariant}`,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div className="graph-paper" style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundSize: '20px 20px' }} />
        <div className="animate-pulse-ring" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 120, height: 120,
          border: `1px solid rgba(0,242,255,0.2)`, borderRadius: '50%',
        }} />
        {/* Node dots */}
        {nodes.slice(0, 8).map((n, i) => (
          <div key={n.id} style={{
            position: 'absolute',
            top: `${20 + (i * 9) % 60}%`,
            left: `${15 + (i * 13) % 70}%`,
            width: 4, height: 4,
            background: C.primary, borderRadius: '50%',
            boxShadow: `0 0 6px ${C.primary}`,
          }} />
        ))}

      </div>

      {/* ── React Flow Canvas (base layer — infinite, no pan limits) ─── */}
      <div ref={reactFlowWrapper} style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode="dark"
          minZoom={0.05}
          maxZoom={3}
          translateExtent={[[-Infinity, -Infinity], [Infinity, Infinity]]}
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent' }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          {/*
           * Background is the FIRST layer rendered inside the React Flow SVG.
           * It pans and zooms with the canvas, giving the illusion of an
           * infinite graph-paper space.
           */}
          <Background
            variant={BackgroundVariant.Lines}
            gap={[100, 100]}
            lineWidth={1.5}
            color="rgba(0,242,255,0.35)"
            style={{ zIndex: -1 }}
          />
          {/* Secondary fine-grid layer */}
          <Background
            id="fine-grid"
            variant={BackgroundVariant.Lines}
            gap={[20, 20]}
            lineWidth={1}
            color="rgba(0,242,255,0.15)"
            style={{ zIndex: -1 }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

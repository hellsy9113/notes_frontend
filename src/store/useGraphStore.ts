/**
 * Summary: Zustand store managing the global state of the React Flow graph.
 * Includes updateNodeData so the editor can sync label/description back to nodes.
 */
import { create } from 'zustand';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type AppNode = Node;
export type AppEdge = Edge;

const STORAGE_KEY = 'neural_nexus_graph';

interface PersistedGraph {
  nodes: AppNode[];
  edges: AppEdge[];
}

function loadGraph(): PersistedGraph {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nodes: [], edges: [] };
    const parsed = JSON.parse(raw) as Partial<PersistedGraph>;
    return {
      nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
      edges: Array.isArray(parsed.edges) ? parsed.edges : [],
    };
  } catch {
    return { nodes: [], edges: [] };
  }
}

function saveGraph(nodes: AppNode[], edges: AppEdge[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch {}
}

interface GraphState {
  nodes: AppNode[];
  edges: AppEdge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  addNode: (node: AppNode) => void;
  clearGraph: () => void;
  /** Patch arbitrary data fields on a node by id */
  updateNodeData: (nodeId: string, patch: Record<string, unknown>) => void;
}

const initial = loadGraph();

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: initial.nodes,
  edges: initial.edges,

  onNodesChange: (changes: NodeChange[]) => {
    const nodes = applyNodeChanges(changes, get().nodes);
    set({ nodes });
    saveGraph(nodes, get().edges);
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const edges = applyEdgeChanges(changes, get().edges);
    set({ edges });
    saveGraph(get().nodes, edges);
  },

  onConnect: (connection: Connection) => {
    const edges = addEdge({ ...connection, type: 'knowledgeEdge' }, get().edges);
    set({ edges });
    saveGraph(get().nodes, edges);
  },

  setNodes: (nodes) => {
    set({ nodes });
    saveGraph(nodes, get().edges);
  },

  setEdges: (edges) => {
    set({ edges });
    saveGraph(get().nodes, edges);
  },

  addNode: (node) => {
    const nodes = [...get().nodes, node];
    set({ nodes });
    saveGraph(nodes, get().edges);
  },

  clearGraph: () => {
    set({ nodes: [], edges: [] });
    localStorage.removeItem(STORAGE_KEY);
  },

  updateNodeData: (nodeId, patch) => {
    const nodes = get().nodes.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
    );
    set({ nodes });
    saveGraph(nodes, get().edges);
  },
}));
/**
 * Summary: Zustand store managing editor windows that are bound to graph nodes.
 * Each editor tab maps 1-to-1 with a node. Edits sync back to the graph store.
 */
import { create } from 'zustand';

export interface EditorTab {
  id: string;          // same as the node id it belongs to
  nodeId: string;      // explicit node reference
  title: string;       // mirrors node label
  content: string;     // mirrors node description / notes
  createdAt: number;
  lastModified: number;
}

const STORAGE_KEY = 'neural_nexus_editors';

function loadEditors(): EditorTab[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEditors(editors: EditorTab[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editors));
  } catch {}
}

interface EditorState {
  editors: EditorTab[];
  activeEditorId: string | null;
  isEditorOpen: boolean;

  /** Open editor for a specific node. Creates tab if not already open. */
  openEditorForNode: (nodeId: string, label: string, content: string) => void;

  closeEditor: (id: string) => void;
  setActiveEditor: (id: string) => void;
  minimizeEditor: () => void;

  /** Update content — caller is responsible for syncing back to the graph store */
  updateContent: (id: string, content: string) => void;

  /** Update title — caller syncs to graph store */
  updateTitle: (id: string, title: string) => void;

  /** Called when a node label changes externally (keeps tab title in sync) */
  syncNodeLabel: (nodeId: string, label: string) => void;

  /** Called when a node is deleted — removes the corresponding tab */
  removeEditorForNode: (nodeId: string) => void;
}

const initialEditors = loadEditors();

export const useEditorStore = create<EditorState>((set, get) => ({
  editors: initialEditors,
  activeEditorId: null,
  isEditorOpen: false,

  openEditorForNode: (nodeId, label, content) => {
    const { editors } = get();
    const existing = editors.find((e) => e.nodeId === nodeId);

    if (existing) {
      set({ activeEditorId: existing.id, isEditorOpen: true });
      return;
    }

    const newTab: EditorTab = {
      id: nodeId,
      nodeId,
      title: label,
      content,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    const updated = [...editors, newTab];
    saveEditors(updated);
    set({ editors: updated, activeEditorId: nodeId, isEditorOpen: true });
  },

  minimizeEditor: () => set({ isEditorOpen: false }),

  closeEditor: (id) => {
    const { editors, activeEditorId } = get();
    const updated = editors.filter((e) => e.id !== id);
    saveEditors(updated);

    let nextActive = activeEditorId;
    if (activeEditorId === id) {
      const idx = editors.findIndex((e) => e.id === id);
      nextActive = updated[idx]?.id ?? updated[idx - 1]?.id ?? null;
    }

    set({
      editors: updated,
      activeEditorId: nextActive,
      isEditorOpen: updated.length > 0 && nextActive !== null,
    });
  },

  setActiveEditor: (id) => set({ activeEditorId: id, isEditorOpen: true }),

  updateContent: (id, content) => {
    const editors = get().editors.map((e) =>
      e.id === id ? { ...e, content, lastModified: Date.now() } : e
    );
    saveEditors(editors);
    set({ editors });
  },

  updateTitle: (id, title) => {
    const editors = get().editors.map((e) =>
      e.id === id ? { ...e, title, lastModified: Date.now() } : e
    );
    saveEditors(editors);
    set({ editors });
  },

  syncNodeLabel: (nodeId, label) => {
    const editors = get().editors.map((e) =>
      e.nodeId === nodeId ? { ...e, title: label } : e
    );
    saveEditors(editors);
    set({ editors });
  },

  removeEditorForNode: (nodeId) => {
    const { editors, activeEditorId } = get();
    const updated = editors.filter((e) => e.nodeId !== nodeId);
    saveEditors(updated);
    const nextActive = activeEditorId === nodeId
      ? (updated[0]?.id ?? null)
      : activeEditorId;
    set({
      editors: updated,
      activeEditorId: nextActive,
      isEditorOpen: updated.length > 0 && nextActive !== null,
    });
  },
}));
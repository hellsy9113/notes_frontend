import { useState, useCallback } from "react";
import type { MouseEvent } from "react";
import type { Node, NodeChange } from "@xyflow/react";
import { applyNodeChanges } from "@xyflow/react";
import type { NoteNodeData, NoteRecord } from "../types";

const API = "http://localhost:5000";

type NoteNode = Node<NoteNodeData>;

export function useNodes() {
  const [nodes, setNodes] = useState<NoteNode[]>([]);

  const updateText = useCallback(async (id: string, content: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: content } } : n
      )
    );
    await fetch(`${API}/nodes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  }, []);

  const deleteNode = useCallback(async (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    await fetch(`${API}/nodes/${id}`, { method: "DELETE" });
  }, []);

  const loadNodes = useCallback(async () => {
    try {
      const res = await fetch(`${API}/nodes`);
      const data: NoteRecord[] = await res.json();
      const formatted: NoteNode[] = data.map((n) => ({
        id: n._id,
        type: "noteNode" as const,
        position: { x: n.x, y: n.y },
        data: { label: n.content, onTextChange: updateText, onDelete: deleteNode },
      }));
      setNodes(formatted);
    } catch (err) {
      console.error("Failed to load nodes", err);
    }
  }, [updateText, deleteNode]);

  const addNode = useCallback(async () => {
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };
    try {
      const res = await fetch(`${API}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "New Note", x: position.x, y: position.y }),
      });
      const saved: NoteRecord = await res.json();
      setNodes((nds) => [
        ...nds,
        {
          id: saved._id,
          type: "noteNode" as const,
          position,
          data: { label: "New Note", onTextChange: updateText, onDelete: deleteNode },
        },
      ]);
    } catch (err) {
      console.error("Failed to create node", err);
    }
  }, [updateText]);

  const onNodeDragStop = useCallback(async (_: MouseEvent, node: NoteNode) => {
    await fetch(`${API}/nodes/${node.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: node.position.x, y: node.position.y }),
    });
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as NoteNode[]),
    []
  );

  return { nodes, loadNodes, addNode, onNodesChange, onNodeDragStop, deleteNode };
}
import type { BuiltInNode, Node } from "@xyflow/react";

export type NoteNode = Node<NoteNodeData, "noteNode">;

export interface NoteRecord {
  _id: string;
  content: string;
  x: number;
  y: number;
}
export type NoteNodeData = {
  label: string;
  onTextChange: (id: string, content: string) => void;
  onDelete: (id: string) => void;
} & Record<string, unknown>;

export type AppNode = NoteNode | BuiltInNode;
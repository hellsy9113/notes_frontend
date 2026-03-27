export interface NoteNodeData {
  label: string;
  onTextChange: (id: string, content: string) => void;
}

export interface NoteRecord {
  _id: string;
  content: string;
  x: number;
  y: number;
}
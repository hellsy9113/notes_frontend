import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

type NoteNodeData = {
  label: string;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
};

export default function NoteNode({ data, id }: NodeProps) {
  const typedData = data as NoteNodeData;
  const [text, setText] = useState(typedData.label || "New Note");

  return (
    <div className="relative bg-yellow-100 border border-yellow-400 rounded-xl shadow-md p-3 w-48 min-h-[80px] group">
      <Handle type="target" position={Position.Top} className="opacity-0" />

      <button
        onClick={() => typedData.onDelete(id)}
        className="absolute top-1 right-1 text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition"
        title="Delete note"
      >
        ✕
      </button>

      <textarea
        className="w-full bg-transparent text-sm text-gray-800 resize-none outline-none pt-2"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          typedData.onTextChange(id, e.target.value);
        }}
        rows={3}
      />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
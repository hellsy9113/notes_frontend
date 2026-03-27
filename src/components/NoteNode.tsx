import { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NoteNodeData } from "../types";

export default function NoteNode({ data, id }: NodeProps<NoteNodeData>) {
  const [text, setText] = useState(data.label || "New Note");

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-xl shadow-md p-3 w-48 min-h-[80px]">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <textarea
        className="w-full bg-transparent text-sm text-gray-800 resize-none outline-none"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          data.onTextChange(id, e.target.value);
        }}
        rows={3}
      />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
import { useEffect, memo } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NoteNode from "./NoteNode";
import { useNodes } from "../hooks/useNodes";

const nodeTypes: NodeTypes = { noteNode: NoteNode as any };

export default function Canvas() {
  const { nodes, loadNodes, addNode, onNodesChange, onNodeDragStop } = useNodes();

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-700">
        <h1 className="text-white font-semibold text-lg tracking-wide">🧠 Spatial Notes</h1>
        <button
          onClick={addNode}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium text-sm px-4 py-2 rounded-lg transition"
        >
          + Add Note
        </button>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <Background color="#334155" gap={24} />
          <Controls />
          <MiniMap nodeColor="#facc15" maskColor="#0f172a99" />
        </ReactFlow>
      </div>
    </div>
  );
}
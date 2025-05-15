"use client";

import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    type: "default",
  },
  {
    id: "2",
    position: { x: 200, y: 100 },
    data: { label: "Node 2" },
    type: "default",
  },
];

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "default",
  },
];

export default function ReactFlowView() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

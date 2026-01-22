import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import "./FlowCanvas.css"; // Import the CSS

function FlowCanvas() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // API data (from Task 1 cache)
  const [posts, setPosts] = useState([]);
  const [nodeCount, setNodeCount] = useState(1);

  // Load cached API data
  useEffect(() => {
    const cachedPosts = localStorage.getItem("posts_cache");
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
    }
  }, []);

  // Add new node with hover effects
  const addNode = () => {
    const label =
      posts.length > 0
        ? posts[(nodeCount - 1) % posts.length].title
        : `Node ${nodeCount}`;

    const newNode = {
      id: `${nodeCount}`,
      data: { label },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 300,
      },
      className: "custom-node", // CSS class for hover effect
    };

    setNodes((prev) => [...prev, newNode]);
    setNodeCount((prev) => prev + 1);
  };

  // Connect nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="flow-container">
      <button className="add-node-btn" onClick={addNode}>
        ➕ Add Node
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default FlowCanvas;

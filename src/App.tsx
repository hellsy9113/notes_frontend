/**
 * Summary: Main application wrapper component handling global layout and rendering the FlowCanvas.
 */
import FlowCanvas from './components/FlowCanvas';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}

export default App;

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Key, Chord } from '../types';
import ColorSphere from './ColorSphere';
import './VisualizationPreview.css';

interface VisualizationPreviewProps {
  selectedKey: Key;
  currentChord?: Chord;
}

const VisualizationPreview = ({ selectedKey, currentChord }: VisualizationPreviewProps) => {
  return (
    <div className="visualization-preview">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ColorSphere selectedKey={selectedKey} currentChord={currentChord} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default VisualizationPreview;

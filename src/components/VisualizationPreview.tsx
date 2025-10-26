import { Canvas } from '@react-three/fiber';
import { Key, Chord } from '../types';
import ColorGradientMesh from './ColorGradientMesh';
import { generateChordColor } from '../utils/colorGenerator';
import './VisualizationPreview.css';

interface VisualizationPreviewProps {
  selectedKey: Key;
  currentChord?: Chord;
}

const VisualizationPreview = ({ selectedKey, currentChord }: VisualizationPreviewProps) => {
  // Generate color for current chord or key
  const chordColor = currentChord
    ? generateChordColor(currentChord, selectedKey)
    : { baseColor: { hue: 0, saturation: 0, lightness: 20 }, chordColor: { hue: 0, saturation: 0, lightness: 20 }, marbleRatio: 0.5 };

  return (
    <div className="visualization-preview">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} orthographic>
        <ColorGradientMesh
          color1={chordColor.baseColor}
          color2={chordColor.chordColor}
          marbleRatio={chordColor.marbleRatio}
          noiseScale={3.0}
          noiseStrength={0.3}
          octaves={4}
        />
      </Canvas>
    </div>
  );
};

export default VisualizationPreview;

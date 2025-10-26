import { Canvas } from '@react-three/fiber';
import { Key, Chord } from '../types';
import ColorGradientMesh from './ColorGradientMesh';
import { generateKeyColor, generateChordColor, getMarbleRatio } from '../utils/colorGenerator';
import './VisualizationPreview.css';

interface VisualizationPreviewProps {
  selectedKey: Key;
  currentChord?: Chord;
}

const VisualizationPreview = ({ selectedKey, currentChord }: VisualizationPreviewProps) => {
  // Generate key color (base color)
  const keyColor = generateKeyColor(selectedKey);

  // Generate chord color and marble ratio if chord exists
  const chordColor = currentChord ? generateChordColor(currentChord, selectedKey, keyColor) : keyColor;
  const marbleRatio = currentChord ? getMarbleRatio(currentChord, selectedKey) : 0.5;

  return (
    <div className="visualization-preview">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} orthographic>
        <ColorGradientMesh
          color1={keyColor}
          color2={chordColor}
          marbleRatio={marbleRatio}
          noiseScale={3.0}
          noiseStrength={0.3}
          octaves={4}
        />
      </Canvas>
    </div>
  );
};

export default VisualizationPreview;

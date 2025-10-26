import { Canvas } from '@react-three/fiber';
import { Key, Chord } from '../types';
import ColorGradientMesh from './ColorGradientMesh';
import CameraReset from './CameraReset';
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
  const marbleRatio = currentChord ? getMarbleRatio(currentChord, selectedKey) : 0.7;

  return (
    <div className="visualization-preview">
      <Canvas
        orthographic
        camera={{
          zoom: 1,
          position: [0, 0, 5],
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          near: 0.1,
          far: 1000
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <CameraReset />
        <ColorGradientMesh
          color1={keyColor}
          color2={chordColor}
          marbleRatio={marbleRatio}
        />
      </Canvas>
    </div>
  );
};

export default VisualizationPreview;

import { Canvas } from '@react-three/fiber';
import { Key, Chord } from '../types';
import ColorGradientMesh from './ColorGradientMesh';
import { generateKeyColor, generateChordColor, getMarbleRatio } from '../utils/colorGenerator';
import './ChordColorPreview.css';

interface ChordColorPreviewProps {
  selectedKey: Key;
  chord: Chord;
}

const ChordColorPreview = ({ selectedKey, chord }: ChordColorPreviewProps) => {
  // Generate key color (base color)
  const keyColor = generateKeyColor(selectedKey);

  // Generate chord color and marble ratio
  const chordColor = generateChordColor(chord, selectedKey, keyColor);
  const marbleRatio = getMarbleRatio(chord, selectedKey);

  return (
    <div className="chord-color-preview">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
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

export default ChordColorPreview;

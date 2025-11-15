import { Canvas } from '@react-three/fiber';
import { Key, Chord, VisualizationStyle } from '../types';
import ColorGradientMesh from './ColorGradientMesh';
import StripesVisualization from './StripesVisualization';
import CameraReset from './CameraReset';
import ParticleSystem from './ParticleSystem';
import { generateKeyColor, generateChordColor, getMarbleRatio, generateParticles } from '../utils/colorGenerator';
import './VisualizationPreview.css';

interface VisualizationPreviewProps {
  selectedKey: Key;
  currentChord?: Chord;
  hueRotation?: number;
  visualizationStyle?: VisualizationStyle;
}

const VisualizationPreview = ({ selectedKey, currentChord, hueRotation = 0, visualizationStyle = 'marble' }: VisualizationPreviewProps) => {
  // Generate key color (base color)
  const keyColor = generateKeyColor(selectedKey, hueRotation);

  // Generate chord color and marble ratio if chord exists
  const chordColor = currentChord ? generateChordColor(currentChord, selectedKey, keyColor) : keyColor;
  const marbleRatio = currentChord ? getMarbleRatio(currentChord, selectedKey) : 0.7;
  const particles = currentChord ? generateParticles(currentChord) : [];

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
        {visualizationStyle === 'marble' ? (
          <ColorGradientMesh
            color1={keyColor}
            color2={chordColor}
            marbleRatio={marbleRatio}
          />
        ) : (
          <StripesVisualization
            color1={keyColor}
            color2={chordColor}
          />
        )}
        {/* Render particles if tensions/alterations exist */}
        {particles.length > 0 && (
          <ParticleSystem
            particles={particles}
            position={[0, 0, 0.05]}
            width={2.0}
            height={2.0}
          />
        )}
      </Canvas>
    </div>
  );
};

export default VisualizationPreview;

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Chord, Key } from '../types';
import { generateKeyColor, generateChordColor, hslToCSS } from '../utils/colorGenerator';
import { getChordDisplayName } from '../utils/diatonic';
import { analyzeHarmonicFunction } from '../utils/harmonicAnalysis';
import ColorGradientMesh from './ColorGradientMesh';
import './VisualizationCanvas.css';

interface VisualizationCanvasProps {
  selectedKey: Key;
  currentChord?: Chord;
  hueRotation?: number;
}

const VisualizationCanvas = ({
  selectedKey,
  currentChord,
  hueRotation = 0
}: VisualizationCanvasProps) => {
  const fallbackCanvasRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Generate colors
  const color1 = generateKeyColor(selectedKey, hueRotation);
  const color2 = currentChord
    ? generateChordColor(currentChord, selectedKey, color1)
    : color1;

  // Get harmonic function info
  const harmonicFunction = currentChord
    ? analyzeHarmonicFunction(currentChord, selectedKey)
    : null;

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS gradient');
      setWebGLSupported(false);
    }
  }, []);

  // Fallback: Apply CSS gradient if WebGL is not supported
  useEffect(() => {
    if (!webGLSupported && fallbackCanvasRef.current) {
      const color1CSS = hslToCSS(color1);
      const color2CSS = hslToCSS(color2);
      fallbackCanvasRef.current.style.background = `linear-gradient(180deg, ${color1CSS} 0%, ${color2CSS} 100%)`;
    }
  }, [webGLSupported, color1, color2]);

  return (
    <div className="visualization-container">
      {webGLSupported ? (
        <div className="visualization-canvas">
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
            <ColorGradientMesh color1={color1} color2={color2} />
          </Canvas>
        </div>
      ) : (
        <div className="visualization-canvas" ref={fallbackCanvasRef}>
          {/* Fallback: CSS gradient for non-WebGL browsers */}
        </div>
      )}

      <div className="visualization-info">
        <div className="color-info">
          <div className="color-block">
            <div
              className="color-swatch"
              style={{ backgroundColor: hslToCSS(color1) }}
            />
            <div className="color-label">
              <div className="color-name">Color 1 (Key)</div>
              <div className="color-value">
                {selectedKey.tonic} {selectedKey.mode}
              </div>
            </div>
          </div>

          {currentChord && (
            <div className="color-block">
              <div
                className="color-swatch"
                style={{ backgroundColor: hslToCSS(color2) }}
              />
              <div className="color-label">
                <div className="color-name">Color 2 (Chord)</div>
                <div className="color-value">
                  {getChordDisplayName(currentChord)}
                  {harmonicFunction && ` (${harmonicFunction.romanNumeral})`}
                </div>
              </div>
            </div>
          )}
        </div>

        {currentChord && harmonicFunction && (
          <div className="harmonic-info">
            <div className="info-item">
              <span className="info-label">Chord:</span>
              <span className="info-value">{getChordDisplayName(currentChord)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Roman Numeral:</span>
              <span className="info-value">{harmonicFunction.romanNumeral}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Function:</span>
              <span className="info-value">
                {harmonicFunction.function.charAt(0).toUpperCase() + harmonicFunction.function.slice(1)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Diatonic:</span>
              <span className="info-value">{harmonicFunction.isDiatonic ? 'Yes' : 'No'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationCanvas;

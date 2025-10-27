import { Key, Chord } from '../types';
import { generateKeyColor, generateChordColor } from '../utils/colorGenerator';
import './ChordColorPreview.css';

interface ChordColorPreviewProps {
  selectedKey: Key;
  chord: Chord;
  hueRotation?: number;
}

const ChordColorPreview = ({ selectedKey, chord, hueRotation = 0 }: ChordColorPreviewProps) => {
  // Generate key color (base color)
  const keyColor = generateKeyColor(selectedKey, hueRotation);

  // Generate chord color (color 2)
  const chordColor = generateChordColor(chord, selectedKey, keyColor);

  // Convert HSL to CSS string
  const backgroundColor = `hsl(${chordColor.hue}, ${chordColor.saturation}%, ${chordColor.lightness}%)`;

  return (
    <div
      className="chord-color-preview"
      style={{ backgroundColor }}
    />
  );
};

export default ChordColorPreview;

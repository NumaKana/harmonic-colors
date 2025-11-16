import { Key, Chord, MinorScaleType } from '../types';
import { generateKeyColor, generateChordColor } from '../utils/colorGenerator';
import './ChordColorPreview.css';

interface ChordColorPreviewProps {
  selectedKey: Key;
  chord: Chord;
  hueRotation?: number;
  minorScaleType?: MinorScaleType;
}

const ChordColorPreview = ({ selectedKey, chord, hueRotation = 0, minorScaleType = 'natural' }: ChordColorPreviewProps) => {
  // Generate key color (base color)
  const keyColor = generateKeyColor(selectedKey, hueRotation);

  // Generate chord color (color 2)
  const chordColor = generateChordColor(chord, selectedKey, keyColor, minorScaleType);

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

import { Key, Chord } from '../types';
import { getDiatonicChords, getRomanNumeral, getChordDisplayName } from '../utils/diatonic';
import './ChordPalette.css';

interface ChordPaletteProps {
  selectedKey: Key;
  onChordSelect: (chord: Chord) => void;
}

const ChordPalette = ({ selectedKey, onChordSelect }: ChordPaletteProps) => {
  const diatonicChords = getDiatonicChords(selectedKey);

  return (
    <div className="chord-palette">
      <h3 className="chord-palette-title">Diatonic Chords</h3>
      <div className="chord-buttons">
        {diatonicChords.map((chord, index) => (
          <button
            key={index}
            className="chord-button"
            onClick={() => onChordSelect(chord)}
            title={`${getRomanNumeral(selectedKey, index)} - ${getChordDisplayName(chord)}`}
          >
            <div className="chord-button-roman">{getRomanNumeral(selectedKey, index)}</div>
            <div className="chord-button-name">{getChordDisplayName(chord)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChordPalette;

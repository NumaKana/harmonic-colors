import { useState } from 'react';
import { Key, Chord } from '../types';
import { getDiatonicChords, getRomanNumeral, getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import ChordColorPreview from './ChordColorPreview';
import './ChordPalette.css';

interface ChordPaletteProps {
  selectedKey: Key;
  onChordSelect: (chord: Chord) => void;
}

type NoteDuration = 4 | 3 | 2 | 1.5 | 1 | 0.75 | 0.5;

const DURATION_OPTIONS: { value: NoteDuration; label: string; symbol: string }[] = [
  { value: 4, label: 'Whole Note', symbol: '𝅝' },
  { value: 3, label: 'Dotted Half Note', symbol: '𝅗𝅥.' },
  { value: 2, label: 'Half Note', symbol: '𝅗𝅥' },
  { value: 1.5, label: 'Dotted Quarter Note', symbol: '♩.' },
  { value: 1, label: 'Quarter Note', symbol: '♩' },
  { value: 0.75, label: 'Dotted Eighth Note', symbol: '♪.' },
  { value: 0.5, label: 'Eighth Note', symbol: '♪' },
];

const ChordPalette = ({ selectedKey, onChordSelect }: ChordPaletteProps) => {
  const diatonicChords = getDiatonicChords(selectedKey);
  const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(4);

  const handleChordClick = async (chord: Chord) => {
    // Create a new chord with the selected duration
    const chordWithDuration: Chord = {
      ...chord,
      duration: selectedDuration,
    };

    try {
      // Stop any currently playing preview sounds
      audioEngine.stop();

      // Play the chord sound
      await audioEngine.playChord(chordWithDuration, 2);
    } catch (error) {
      console.error('Failed to play chord:', error);
      // Continue with adding to progression even if audio fails
    }
    // Add to progression
    onChordSelect(chordWithDuration);
  };

  return (
    <div className="chord-palette">
      <div className="chord-palette-header">
        <h3 className="chord-palette-title">Diatonic Chords</h3>
        <div className="duration-selector">
          <label htmlFor="duration-select" className="duration-label">
            Duration:
          </label>
          <select
            id="duration-select"
            className="duration-select"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value) as NoteDuration)}
            title="Select note duration for added chords"
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.symbol} {option.label} ({option.value} beats)
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="chord-buttons">
        {diatonicChords.map((chord, index) => (
          <div key={index} className="chord-button-container">
            <button
              className="chord-button"
              onClick={() => handleChordClick(chord)}
              title={`${getRomanNumeral(selectedKey, index)} - ${getChordDisplayName(chord)}`}
            >
              <div className="chord-button-roman">{getRomanNumeral(selectedKey, index)}</div>
              <div className="chord-button-name">{getChordDisplayName(chord)}</div>
            </button>
            <ChordColorPreview selectedKey={selectedKey} chord={chord} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordPalette;

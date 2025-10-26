import { Chord } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import './ChordSequence.css';

interface ChordSequenceProps {
  chords: Chord[];
  onRemoveChord: (index: number) => void;
  currentIndex?: number;
}

// Helper function to get note symbol from duration
const getDurationSymbol = (duration: number): string => {
  switch (duration) {
    case 4:
      return '𝅝'; // Whole note
    case 3:
      return '𝅗𝅥.'; // Dotted half note
    case 2:
      return '𝅗𝅥'; // Half note
    case 1.5:
      return '♩.'; // Dotted quarter note
    case 1:
      return '♩'; // Quarter note
    case 0.75:
      return '♪.'; // Dotted eighth note
    case 0.5:
      return '♪'; // Eighth note
    default:
      return `${duration}♩`; // Fallback: show duration + quarter note
  }
};

const ChordSequence = ({ chords, onRemoveChord, currentIndex }: ChordSequenceProps) => {
  const handleChordClick = async (chord: Chord) => {
    try {
      await audioEngine.playChord(chord, 1);
    } catch (error) {
      console.error('Failed to play chord preview:', error);
    }
  };

  if (chords.length === 0) {
    return (
      <div className="chord-sequence">
        <h3 className="chord-sequence-title">Chord Progression</h3>
        <div className="chord-sequence-empty">
          No chords added yet. Click on a chord above to add it to the progression.
        </div>
      </div>
    );
  }

  return (
    <div className="chord-sequence">
      <h3 className="chord-sequence-title">
        Chord Progression ({chords.length} chord{chords.length !== 1 ? 's' : ''})
      </h3>
      <div className="chord-sequence-list">
        {chords.map((chord, index) => (
          <div
            key={index}
            className={`chord-item ${currentIndex === index ? 'chord-item-current' : ''}`}
          >
            <div
              className="chord-item-content"
              onClick={() => handleChordClick(chord)}
              style={{ cursor: 'pointer' }}
              title={`Click to preview ${getChordDisplayName(chord)} (${chord.duration} beats)`}
            >
              <span className="chord-item-index">{index + 1}</span>
              <span className="chord-item-name">{getChordDisplayName(chord)}</span>
              <span className="chord-item-duration" title={`${chord.duration} beats`}>
                {getDurationSymbol(chord.duration)}
              </span>
            </div>
            <button
              className="chord-item-remove"
              onClick={() => onRemoveChord(index)}
              title={`Remove ${getChordDisplayName(chord)} from progression`}
              aria-label={`Remove ${getChordDisplayName(chord)}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordSequence;

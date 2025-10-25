import { Chord } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import './ChordSequence.css';

interface ChordSequenceProps {
  chords: Chord[];
  onRemoveChord: (index: number) => void;
  currentIndex?: number;
}

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
              title={`Click to preview ${getChordDisplayName(chord)}`}
            >
              <span className="chord-item-index">{index + 1}</span>
              <span className="chord-item-name">{getChordDisplayName(chord)}</span>
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

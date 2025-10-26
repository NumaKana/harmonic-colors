import { Chord } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import './ChordSequence.css';

interface ChordSequenceProps {
  chords: Chord[];
  onRemoveChord: (index: number) => void;
  onSelectChord: (index: number) => void;
  currentIndex?: number;
  selectedIndex?: number;
  timeSignature?: number;
}

interface MeasureChord {
  chord: Chord;
  originalIndex: number;
}

interface Measure {
  chords: MeasureChord[];
  measureNumber: number;
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

// Helper function to group chords into measures
const groupIntoMeasures = (chords: Chord[], beatsPerMeasure: number): Measure[] => {
  const measures: Measure[] = [];
  let currentMeasure: MeasureChord[] = [];
  let currentBeats = 0;
  let measureNumber = 1;

  chords.forEach((chord, index) => {
    const remainingBeatsInMeasure = beatsPerMeasure - currentBeats;

    if (chord.duration <= remainingBeatsInMeasure) {
      // Chord fits in current measure
      currentMeasure.push({ chord, originalIndex: index });
      currentBeats += chord.duration;

      // If measure is complete, start a new one
      if (currentBeats === beatsPerMeasure) {
        measures.push({ chords: currentMeasure, measureNumber });
        currentMeasure = [];
        currentBeats = 0;
        measureNumber++;
      }
    } else {
      // Chord spans multiple measures - for now, just start a new measure
      if (currentMeasure.length > 0) {
        measures.push({ chords: currentMeasure, measureNumber });
        measureNumber++;
      }
      currentMeasure = [{ chord, originalIndex: index }];
      currentBeats = chord.duration % beatsPerMeasure;

      // Handle chords longer than a measure
      const fullMeasures = Math.floor(chord.duration / beatsPerMeasure);
      if (fullMeasures > 0 && currentBeats === 0) {
        currentBeats = 0;
      }
    }
  });

  // Add remaining chords as final measure
  if (currentMeasure.length > 0) {
    measures.push({ chords: currentMeasure, measureNumber });
  }

  return measures;
};

const ChordSequence = ({ chords, onRemoveChord, onSelectChord, currentIndex, selectedIndex, timeSignature = 4 }: ChordSequenceProps) => {
  const handleChordClick = async (chord: Chord, index: number) => {
    // Select the chord
    onSelectChord(index);

    // Play preview
    try {
      await audioEngine.playChord(chord, 1);
    } catch (error) {
      console.error('Failed to play chord preview:', error);
    }
  };

  const measures = groupIntoMeasures(chords, timeSignature);

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
        Chord Progression ({chords.length} chord{chords.length !== 1 ? 's' : ''}, {measures.length} measure{measures.length !== 1 ? 's' : ''})
      </h3>
      <div className="chord-sequence-measures">
        {measures.map((measure) => (
          <div key={measure.measureNumber} className="measure">
            <div className="measure-number">{measure.measureNumber}</div>
            <div className="measure-content">
              {measure.chords.map(({ chord, originalIndex }) => {
                const widthPercent = (chord.duration / timeSignature) * 100;
                const isPlaying = currentIndex === originalIndex;
                const isSelected = selectedIndex === originalIndex;
                return (
                  <div
                    key={originalIndex}
                    className={`measure-chord ${isPlaying ? 'measure-chord-current' : ''} ${isSelected ? 'measure-chord-selected' : ''}`}
                    style={{ width: `${widthPercent}%` }}
                    onClick={() => handleChordClick(chord, originalIndex)}
                    title={`Click to select ${getChordDisplayName(chord)} (${chord.duration} beats)`}
                  >
                    <div className="measure-chord-content">
                      <span className="measure-chord-name">{getChordDisplayName(chord)}</span>
                      <span className="measure-chord-duration" title={`${chord.duration} beats`}>
                        {getDurationSymbol(chord.duration)}
                      </span>
                    </div>
                    <button
                      className="measure-chord-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveChord(originalIndex);
                      }}
                      title={`Remove ${getChordDisplayName(chord)} from progression`}
                      aria-label={`Remove ${getChordDisplayName(chord)}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordSequence;

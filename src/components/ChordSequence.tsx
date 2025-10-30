import { Chord, Section } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import './ChordSequence.css';

interface ChordSequenceProps {
  sections: Section[];
  currentSectionId: string;
  onRemoveChord: (index: number) => void;
  onSelectChord: (index: number) => void;
  currentIndex?: number;
  selectedIndex?: number;
  timeSignature?: number;
}

interface MeasureChord {
  chord: Chord;
  originalIndex: number;
  sectionId: string;
}

interface Measure {
  chords: MeasureChord[];
  measureNumber: number;
  sectionId: string;
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

// Helper function to group all sections' chords into measures
const groupSectionsIntoMeasures = (sections: Section[], beatsPerMeasure: number): Measure[] => {
  const measures: Measure[] = [];
  let currentMeasure: MeasureChord[] = [];
  let currentBeats = 0;
  let measureNumber = 1;
  let globalChordIndex = 0;

  sections.forEach((section) => {
    section.chords.forEach((chord) => {
      const remainingBeatsInMeasure = beatsPerMeasure - currentBeats;

      if (chord.duration <= remainingBeatsInMeasure) {
        // Chord fits in current measure
        currentMeasure.push({ chord, originalIndex: globalChordIndex, sectionId: section.id });
        currentBeats += chord.duration;

        // If measure is complete, start a new one
        if (currentBeats === beatsPerMeasure) {
          measures.push({
            chords: currentMeasure,
            measureNumber,
            sectionId: section.id
          });
          currentMeasure = [];
          currentBeats = 0;
          measureNumber++;
        }
      } else {
        // Chord spans multiple measures - for now, just start a new measure
        if (currentMeasure.length > 0) {
          measures.push({
            chords: currentMeasure,
            measureNumber,
            sectionId: section.id
          });
          measureNumber++;
        }
        currentMeasure = [{ chord, originalIndex: globalChordIndex, sectionId: section.id }];
        currentBeats = chord.duration % beatsPerMeasure;

        // Handle chords longer than a measure
        const fullMeasures = Math.floor(chord.duration / beatsPerMeasure);
        if (fullMeasures > 0 && currentBeats === 0) {
          currentBeats = 0;
        }
      }
      globalChordIndex++;
    });
  });

  // Add remaining chords as final measure
  if (currentMeasure.length > 0) {
    const lastSectionId = currentMeasure[0]?.sectionId || sections[sections.length - 1]?.id || '';
    measures.push({ chords: currentMeasure, measureNumber, sectionId: lastSectionId });
  }

  return measures;
};

// Helper function to group measures into rows (4 measures per row)
const groupMeasuresIntoRows = (measures: Measure[], measuresPerRow: number = 4): Measure[][] => {
  const rows: Measure[][] = [];
  for (let i = 0; i < measures.length; i += measuresPerRow) {
    rows.push(measures.slice(i, i + measuresPerRow));
  }
  return rows;
};

const ChordSequence = ({ sections, currentSectionId, onRemoveChord, onSelectChord, currentIndex, selectedIndex, timeSignature = 4 }: ChordSequenceProps) => {
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

  const measures = groupSectionsIntoMeasures(sections, timeSignature);
  const rows = groupMeasuresIntoRows(measures, 4);

  const totalChords = sections.reduce((sum, section) => sum + section.chords.length, 0);

  if (totalChords === 0) {
    return (
      <div className="chord-sequence">
        <h3 className="chord-sequence-title">Chord Progression</h3>
        <div className="chord-sequence-empty">
          No chords added yet. Click on a chord above to add it to the progression.
        </div>
      </div>
    );
  }

  // Calculate section brackets (which measures belong to which section)
  const sectionBrackets: Array<{ sectionId: string; startMeasure: number; endMeasure: number; rowIndex: number; startCol: number; endCol: number }> = [];
  let currentSectionInRow = '';
  let startMeasure = 0;
  let startCol = 0;

  rows.forEach((row, rowIndex) => {
    row.forEach((measure, colIndex) => {
      if (measure.sectionId !== currentSectionInRow) {
        // Section changed
        if (currentSectionInRow) {
          sectionBrackets.push({
            sectionId: currentSectionInRow,
            startMeasure,
            endMeasure: measure.measureNumber - 1,
            rowIndex: rowIndex - (colIndex === 0 ? 1 : 0),
            startCol,
            endCol: colIndex === 0 ? row.length : colIndex
          });
        }
        currentSectionInRow = measure.sectionId;
        startMeasure = measure.measureNumber;
        startCol = colIndex;
      }
    });
  });
  // Add final bracket
  if (currentSectionInRow) {
    sectionBrackets.push({
      sectionId: currentSectionInRow,
      startMeasure,
      endMeasure: measures[measures.length - 1].measureNumber,
      rowIndex: rows.length - 1,
      startCol,
      endCol: rows[rows.length - 1].length
    });
  }

  return (
    <div className="chord-sequence">
      <h3 className="chord-sequence-title">
        Chord Progression ({totalChords} chord{totalChords !== 1 ? 's' : ''}, {measures.length} measure{measures.length !== 1 ? 's' : ''})
      </h3>
      <div className="chord-sequence-rows">
        {rows.map((row, rowIndex) => {
          // Find brackets for this row
          const rowBrackets = sectionBrackets.filter(b => b.rowIndex === rowIndex);

          return (
            <div key={rowIndex} className="measure-row-container">
              {/* Section brackets */}
              <div className="section-brackets">
                {rowBrackets.map((bracket, bracketIndex) => {
                  const section = sections.find(s => s.id === bracket.sectionId);
                  if (!section) return null;

                  const widthPercent = ((bracket.endCol - bracket.startCol) / 4) * 100;
                  const leftPercent = (bracket.startCol / 4) * 100;

                  return (
                    <div
                      key={bracketIndex}
                      className={`section-bracket ${section.id === currentSectionId ? 'section-bracket-current' : ''}`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    >
                      <div className="section-bracket-label">
                        {section.name}: {section.key.tonic} {section.key.mode === 'major' ? 'Major' : 'Minor'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Measures */}
              <div className="measure-row">
                {row.map((measure) => (
                  <div key={measure.measureNumber} className="measure">
                    <div className="measure-number">{measure.measureNumber}</div>
                    <div className="measure-content">
                      {measure.chords.map(({ chord, originalIndex, sectionId }) => {
                        const widthPercent = (chord.duration / timeSignature) * 100;
                        const isPlaying = currentIndex === originalIndex;
                        const isSelected = selectedIndex === originalIndex;
                        const isCurrentSection = sectionId === currentSectionId;
                        return (
                          <div
                            key={originalIndex}
                            className={`measure-chord ${isPlaying ? 'measure-chord-current' : ''} ${isSelected ? 'measure-chord-selected' : ''} ${isCurrentSection ? 'measure-chord-current-section' : 'measure-chord-other-section'}`}
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
        })}
      </div>
    </div>
  );
};

export default ChordSequence;

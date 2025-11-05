import { Chord, Section, Key } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import KeySelector from './KeySelector';
import './ChordSequence.css';

interface ChordSequenceProps {
  sections: Section[];
  currentSectionId: string;
  currentSectionKey: Key;
  onRemoveChord: (index: number) => void;
  onSelectChord: (index: number) => void;
  onSectionSelect: (id: string) => void;
  onSectionAdd: () => void;
  onSectionRemove: (id: string) => void;
  onSectionKeyChange: (id: string, key: Key) => void;
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
    // If section is empty, add one empty measure for it
    if (section.chords.length === 0) {
      // Finish current measure if there are chords in it
      if (currentMeasure.length > 0) {
        measures.push({
          chords: currentMeasure,
          measureNumber,
          sectionId: currentMeasure[0].sectionId
        });
        currentMeasure = [];
        currentBeats = 0;
        measureNumber++;
      }

      // Add empty measure for this section
      measures.push({
        chords: [],
        measureNumber,
        sectionId: section.id
      });
      measureNumber++;
      return;
    }

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

const ChordSequence = ({ sections, currentSectionId, currentSectionKey, onRemoveChord, onSelectChord, onSectionSelect, onSectionAdd, onSectionRemove, onSectionKeyChange, currentIndex, selectedIndex, timeSignature = 4 }: ChordSequenceProps) => {
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

  const totalChords = sections.reduce((sum, section) => sum + section.chords.length, 0);

  // Generate measures (empty sections will have one empty measure each)
  const measures = groupSectionsIntoMeasures(sections, timeSignature);
  const rows = groupMeasuresIntoRows(measures, 4);

  // Calculate section brackets for each row
  const sectionBracketsByRow: Array<Array<{ sectionId: string; startCol: number; endCol: number }>> = [];

  rows.forEach((row) => {
    const rowBrackets: Array<{ sectionId: string; startCol: number; endCol: number }> = [];
    let currentSectionInRow = '';
    let startCol = 0;

    row.forEach((measure, colIndex) => {
      if (measure.sectionId !== currentSectionInRow) {
        // Section changed
        if (currentSectionInRow) {
          rowBrackets.push({
            sectionId: currentSectionInRow,
            startCol,
            endCol: colIndex
          });
        }
        currentSectionInRow = measure.sectionId;
        startCol = colIndex;
      }
    });

    // Add final bracket for this row
    if (currentSectionInRow) {
      rowBrackets.push({
        sectionId: currentSectionInRow,
        startCol,
        endCol: row.length
      });
    }

    sectionBracketsByRow.push(rowBrackets);
  });

  return (
    <div className="chord-sequence">
      <div className="chord-sequence-header">
        <h3 className="chord-sequence-title">
          Chord Progression ({totalChords} chord{totalChords !== 1 ? 's' : ''}, {measures.length} measure{measures.length !== 1 ? 's' : ''})
        </h3>
        <div className="chord-sequence-controls">
          <KeySelector
            selectedKey={currentSectionKey}
            onKeyChange={(key) => onSectionKeyChange(currentSectionId, key)}
            compact={true}
          />
          <button className="add-key-button" onClick={onSectionAdd} title="Add new section with different key">
            + Add Key
          </button>
        </div>
      </div>
      <div className="chord-sequence-rows">
        {rows.map((row, rowIndex) => {
          // Find brackets for this row
          const rowBrackets = sectionBracketsByRow[rowIndex] || [];

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
                      onClick={() => onSectionSelect(section.id)}
                      title={`Click to edit ${section.name}`}
                    >
                      <div className="section-bracket-label">
                        {section.name}: {section.key.tonic} {section.key.mode === 'major' ? 'Major' : 'Minor'}
                      </div>
                      {sections.length > 1 && (
                        <button
                          className="section-bracket-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSectionRemove(section.id);
                          }}
                          title={`Remove ${section.name}`}
                          aria-label={`Remove ${section.name}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Measures */}
              <div className="measure-row">
                {row.map((measure) => {
                  // Calculate measure width: each measure takes 1/4 of the row (25%)
                  const measureWidthPercent = (1 / 4) * 100;

                  return (
                    <div key={measure.measureNumber} className="measure" style={{ width: `${measureWidthPercent}%` }}>
                      <div className="measure-number">{measure.measureNumber}</div>
                      <div className="measure-content" style={{ gridTemplateColumns: `repeat(${timeSignature}, 1fr)` }}>
                      {/* Create beat grid slots based on time signature */}
                      {Array.from({ length: timeSignature }).map((_, beatIndex) => {
                        // Find which chord (if any) occupies this beat
                        let beatPosition = 0;
                        let chordForThisBeat = null;
                        let isFirstBeatOfChord = false;

                        for (const { chord, originalIndex, sectionId } of measure.chords) {
                          const chordStartBeat = beatPosition;
                          const chordEndBeat = beatPosition + chord.duration;

                          if (beatIndex >= chordStartBeat && beatIndex < chordEndBeat) {
                            chordForThisBeat = { chord, originalIndex, sectionId };
                            isFirstBeatOfChord = beatIndex === chordStartBeat;
                            break;
                          }
                          beatPosition += chord.duration;
                        }

                        // Only render the chord on its first beat, spanning multiple beats
                        if (chordForThisBeat && isFirstBeatOfChord) {
                          const { chord, originalIndex, sectionId } = chordForThisBeat;
                          const widthInBeats = chord.duration;
                          const isPlaying = currentIndex === originalIndex;
                          const isSelected = selectedIndex === originalIndex;
                          const isCurrentSection = sectionId === currentSectionId;

                          return (
                            <div
                              key={`${originalIndex}-${beatIndex}`}
                              className={`measure-chord ${isPlaying ? 'measure-chord-current' : ''} ${isSelected ? 'measure-chord-selected' : ''} ${isCurrentSection ? 'measure-chord-current-section' : 'measure-chord-other-section'}`}
                              style={{ gridColumn: `span ${widthInBeats}` }}
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
                        } else if (!chordForThisBeat && measure.chords.length === 0) {
                          // Empty beat slot (only for empty measures)
                          return null;
                        } else if (!chordForThisBeat) {
                          // This beat is part of a previous chord, skip
                          return null;
                        }

                        return null;
                      })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChordSequence;

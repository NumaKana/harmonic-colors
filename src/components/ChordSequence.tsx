import { useState, useEffect } from 'react';
import { Chord, Section, Key } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import KeySelector from './KeySelector';
import './ChordSequence.css';
import PlaybackControls from './PlaybackControls';

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
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange?: (position: number) => void;
  onTimeSignatureChange?: (timeSignature: number) => void;
  onBpmChange?: (bpm: number) => void;
  onMetronomeChange?: (enabled: boolean) => void;
  metronomeEnabled?: boolean;
  currentSection: Section;
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

const ChordSequence = ({ sections, currentSectionId, currentSectionKey, onRemoveChord, onSelectChord, onSectionSelect, onSectionAdd, onSectionRemove, onSectionKeyChange, currentIndex, selectedIndex, timeSignature = 4, onPlayingIndexChange, onPlaybackPositionChange, onTimeSignatureChange, onBpmChange, onMetronomeChange, metronomeEnabled }: ChordSequenceProps) => {
  // Track window width to determine columns per row
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine columns based on window width
  const getColumnsPerRow = () => {
    if (windowWidth <= 600) return 1;
    if (windowWidth <= 900) return 2;
    return 4;
  };

  const columnsPerRow = getColumnsPerRow();

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
  const rows = groupMeasuresIntoRows(measures, columnsPerRow);

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
      <PlaybackControls
        onPlayingIndexChange={onPlayingIndexChange}
        onPlaybackPositionChange={onPlaybackPositionChange}
        onTimeSignatureChange={onTimeSignatureChange}
        onBpmChange={onBpmChange}
        onMetronomeChange={onMetronomeChange}
        metronomeEnabled={metronomeEnabled}
        currentSection={sections.find(s => s.id === currentSectionId) || sections[0]}
      />
      <div className="chord-sequence-header">
        <p className="chord-sequence-title title">
          Chord Progression ({totalChords} chord{totalChords !== 1 ? 's' : ''}, {measures.length} measure{measures.length !== 1 ? 's' : ''})
        </p>
        <div className="chord-sequence-controls">
          <KeySelector
            selectedKey={currentSectionKey}
            onKeyChange={(key) => onSectionKeyChange(currentSectionId, key)}
            compact={true}
          />
          <button className="add-key-button clickable" onClick={onSectionAdd} title="Add new section with different key">
            + Add Section
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

                  // Calculate width based on actual columns that will be displayed
                  // Desktop: 4 columns, Tablet (900px): 2 columns, Mobile (600px): 1 column
                  // We need to map bracket positions (0-4 for 4 measures) to visible columns
                  // For example: if row has 4 measures but only 2 are visible per row,
                  // measures 0-1 are on first visual row, measures 2-3 are on second visual row

                  // Map measure indices to visual columns (wrapping based on columnsPerRow)
                  const startVisualCol = bracket.startCol % columnsPerRow;
                  const endVisualCol = bracket.endCol % columnsPerRow === 0 && bracket.endCol > 0
                    ? columnsPerRow
                    : bracket.endCol % columnsPerRow;

                  // Calculate how many visual rows this bracket spans
                  const startRow = Math.floor(bracket.startCol / columnsPerRow);
                  const endRow = Math.floor((bracket.endCol - 1) / columnsPerRow);

                  // If bracket spans multiple visual rows, only show it on its starting row
                  // and extend to the end of that row
                  const actualEndCol = startRow === endRow ? endVisualCol : columnsPerRow;

                  const widthPercent = ((actualEndCol - startVisualCol) / columnsPerRow) * 100;
                  const leftPercent = (startVisualCol / columnsPerRow) * 100;
                  const margin = startVisualCol === 0 ? 0 : 0.8;

                  return (
                    <div
                      key={bracketIndex}
                      className={`section-bracket ${section.id === currentSectionId ? 'section-bracket-current' : ''}`}
                      style={{
                        left: `${leftPercent + margin}%`,
                        width: `${widthPercent - margin}%`,
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
                  return (
                    <div key={measure.measureNumber} className="measure">
                      <div className="measure-number">{measure.measureNumber}</div>
                      <div className="measure-content" style={{ gridTemplateColumns: `repeat(${timeSignature}, 1fr)` }}>
                      {/* Create beat grid slots based on time signature */}
                      {Array.from({ length: timeSignature }).map((_, beatIndex) => {
                        // Find which chord (if any) occupies this beat
                        let beatPosition = 0;
                        let chordForThisBeat = null;
                        let isFirstBeatOfChord = false;
                        let chordStartBeat = 0;
                        let chordEndBeat = 0;

                        for (const { chord, originalIndex, sectionId } of measure.chords) {
                          const startBeat = beatPosition;
                          const endBeat = beatPosition + chord.duration;

                          // Check if this beat slot overlaps with the chord's time span
                          if (beatIndex < endBeat && beatIndex + 1 > startBeat) {
                            chordForThisBeat = { chord, originalIndex, sectionId };
                            chordStartBeat = startBeat;
                            chordEndBeat = endBeat;
                            // A chord starts at the first beat it occupies (floor of start position)
                            isFirstBeatOfChord = Math.floor(startBeat) === beatIndex;
                            // Don't break - we want the last matching chord if multiple chords overlap this beat
                          }
                          beatPosition += chord.duration;
                        }

                        // Only render the chord on its first beat, spanning multiple beats
                        if (chordForThisBeat && isFirstBeatOfChord) {
                          const { chord, originalIndex, sectionId } = chordForThisBeat;
                          // Calculate how many beat grid positions this chord should span
                          // We need to check if there's another chord starting at a later beat in this measure
                          let widthInBeats = chord.duration;

                          // Check if the next chord in the measure starts before this chord ends
                          let nextChordStartBeat = null;
                          let tempBeatPosition = 0;
                          let foundCurrent = false;

                          for (const { chord: c } of measure.chords) {
                            if (foundCurrent) {
                              nextChordStartBeat = tempBeatPosition;
                              break;
                            }
                            if (c === chord) {
                              foundCurrent = true;
                            }
                            tempBeatPosition += c.duration;
                          }

                          if (nextChordStartBeat !== null && nextChordStartBeat <= chordEndBeat) {
                            // Next chord starts before or when this one ends - adjust width to avoid overlap
                            const nextChordFirstBeat = Math.floor(nextChordStartBeat);
                            const thisChordFirstBeat = Math.floor(chordStartBeat);
                            widthInBeats = Math.max(1, nextChordFirstBeat - thisChordFirstBeat);
                          } else {
                            // No overlap - use full duration
                            const firstBeatPos = Math.floor(chordStartBeat);
                            const lastBeatPos = Math.ceil(chordEndBeat) - 1;
                            widthInBeats = lastBeatPos - firstBeatPos + 1;
                          }

                          widthInBeats = Math.min(widthInBeats, timeSignature - beatIndex);
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

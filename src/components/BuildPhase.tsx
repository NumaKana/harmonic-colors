import { Key, Chord, Section, MinorScaleType, VisualizationStyle } from '../types';
import ChordPalette from './ChordPalette';
import ChordSequence from './ChordSequence';
import PlaybackControls from './PlaybackControls';
import VisualizationPreview from './VisualizationPreview';
import EditableChordInfo from './EditableChordInfo';
import { generateKeyColor, generateChordColor, hslToCSS } from '../utils/colorGenerator';
import { getChordDisplayName } from '../utils/diatonic';
import { analyzeHarmonicFunction } from '../utils/harmonicAnalysis';
import './BuildPhase.css';

interface BuildPhaseProps {
  selectedKey: Key;
  chords: Chord[];
  allChords: Chord[]; // All chords from all sections for playback
  onChordSelect: (chord: Chord) => void;
  onRemoveChord: (index: number) => void;
  onSelectChord: (index: number) => void;
  onUpdateChord: (index: number, chord: Chord) => void;
  currentIndex?: number;
  selectedIndex?: number;
  timeSignature: number;
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange: (position: number) => void;
  onTimeSignatureChange: (timeSignature: number) => void;
  onBpmChange: (bpm: number) => void;
  onMetronomeChange: (enabled: boolean) => void;
  hueRotation: number;
  minorScaleType: MinorScaleType;
  visualizationStyle: VisualizationStyle;
  // Section management
  sections: Section[];
  currentSectionId: string;
  onSectionSelect: (id: string) => void;
  onSectionAdd: () => void;
  onSectionRemove: (id: string) => void;
  onSectionNameChange: (id: string, name: string) => void;
  onSectionKeyChange: (id: string, key: Key) => void;
}

const BuildPhase = ({
  selectedKey,
  chords,
  allChords,
  onChordSelect,
  onRemoveChord,
  onSelectChord,
  onUpdateChord,
  currentIndex,
  selectedIndex,
  timeSignature,
  onPlayingIndexChange,
  onPlaybackPositionChange,
  onTimeSignatureChange,
  onBpmChange,
  onMetronomeChange,
  hueRotation,
  minorScaleType,
  visualizationStyle,
  sections,
  currentSectionId,
  onSectionSelect,
  onSectionAdd,
  onSectionRemove,
  onSectionNameChange: _onSectionNameChange,
  onSectionKeyChange
}: BuildPhaseProps) => {
  // Get current chord for preview
  const currentChord = selectedIndex !== undefined && selectedIndex >= 0
    ? chords[selectedIndex]
    : chords.length > 0
    ? chords[chords.length - 1]
    : undefined;

  // Generate colors for info display
  const color1 = generateKeyColor(selectedKey, hueRotation);
  const color2 = currentChord ? generateChordColor(currentChord, selectedKey, color1) : color1;

  // Get harmonic function info
  const harmonicFunction = currentChord ? analyzeHarmonicFunction(currentChord, selectedKey) : null;

  return (
    <div className="build-phase">
      <ChordPalette selectedKey={selectedKey} onChordSelect={onChordSelect} hueRotation={hueRotation} minorScaleType={minorScaleType} />
      <ChordSequence
        sections={sections}
        currentSectionId={currentSectionId}
        currentSectionKey={selectedKey}
        onRemoveChord={onRemoveChord}
        onSelectChord={onSelectChord}
        onSectionSelect={onSectionSelect}
        onSectionAdd={onSectionAdd}
        onSectionRemove={onSectionRemove}
        onSectionKeyChange={onSectionKeyChange}
        currentIndex={currentIndex}
        selectedIndex={selectedIndex}
        timeSignature={timeSignature}
      />
      <PlaybackControls
        chords={allChords}
        onPlayingIndexChange={onPlayingIndexChange}
        onPlaybackPositionChange={onPlaybackPositionChange}
        onTimeSignatureChange={onTimeSignatureChange}
        onBpmChange={onBpmChange}
        onMetronomeChange={onMetronomeChange}
      />

      <VisualizationPreview
        selectedKey={selectedKey}
        currentChord={currentChord}
        hueRotation={hueRotation}
        visualizationStyle={visualizationStyle}
      />

      <div className="visualization-info">
        <div className="color-info">
          <div className="color-block">
            <div
              className="color-swatch"
              style={{ backgroundColor: hslToCSS(color1) }}
            />
            <div className="color-label">
              <div className="color-name">Color 1 (Key)</div>
              <div className="color-value">
                {selectedKey.tonic} {selectedKey.mode}
              </div>
            </div>
          </div>

          {currentChord && (
            <div className="color-block">
              <div
                className="color-swatch"
                style={{ backgroundColor: hslToCSS(color2) }}
              />
              <div className="color-label">
                <div className="color-name">Color 2 (Chord)</div>
                <div className="color-value">
                  {getChordDisplayName(currentChord)}
                  {harmonicFunction && ` (${harmonicFunction.romanNumeral})`}
                </div>
              </div>
            </div>
          )}
        </div>

        {currentChord && harmonicFunction && (
          <div className="harmonic-info">
            <div className="info-item">
              <span className="info-label">Chord:</span>
              <span className="info-value">{getChordDisplayName(currentChord)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Roman Numeral:</span>
              <span className="info-value">{harmonicFunction.romanNumeral}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Function:</span>
              <span className="info-value">
                {harmonicFunction.function.charAt(0).toUpperCase() + harmonicFunction.function.slice(1)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Diatonic:</span>
              <span className="info-value">{harmonicFunction.isDiatonic ? 'Yes' : 'No'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Editable chord info when a chord is selected */}
      {selectedIndex !== undefined && selectedIndex >= 0 && currentChord && (
        <EditableChordInfo
          chord={currentChord}
          chordIndex={selectedIndex}
          onUpdate={onUpdateChord}
        />
      )}
    </div>
  );
};

export default BuildPhase;

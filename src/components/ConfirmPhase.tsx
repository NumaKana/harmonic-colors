import { Key, Chord, Section, MinorScaleType, VisualizationStyle } from '../types';
import VisualizationCanvas from './VisualizationCanvas';
import ChordNameBar from './ChordNameBar';
import './ConfirmPhase.css';

interface ConfirmPhaseProps {
  selectedKey: Key;
  currentChord?: Chord;
  chordProgression: Chord[];
  allChords: Chord[]; // All chords from all sections for playback
  sections: Section[]; // All sections for key lookup
  currentChordIndex: number;
  playbackPosition: number;
  bpm: number;
  metronomeEnabled: boolean;
  timeSignature: number;
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange: (position: number) => void;
  majorHueRotation: number;
  minorHueRotation: number;
  minorScaleType: MinorScaleType;
  visualizationStyle: VisualizationStyle;
}

const ConfirmPhase = ({
  selectedKey,
  currentChord,
  chordProgression: _chordProgression,
  allChords,
  sections,
  currentChordIndex,
  playbackPosition,
  bpm,
  metronomeEnabled,
  timeSignature,
  onPlayingIndexChange,
  onPlaybackPositionChange,
  majorHueRotation,
  minorHueRotation,
  minorScaleType,
  visualizationStyle
}: ConfirmPhaseProps) => {
  return (
    <div className="confirm-phase">
      
      <VisualizationCanvas
        selectedKey={selectedKey}
        currentChord={currentChord}
        chordProgression={allChords}
        sections={sections}
        currentChordIndex={currentChordIndex}
        playbackPosition={playbackPosition}
        bpm={bpm}
        metronomeEnabled={metronomeEnabled}
        timeSignature={timeSignature}
        onPlayingIndexChange={onPlayingIndexChange}
        onPlaybackPositionChange={onPlaybackPositionChange}
        majorHueRotation={majorHueRotation}
        minorHueRotation={minorHueRotation}
        minorScaleType={minorScaleType}
        visualizationStyle={visualizationStyle}
      />
    </div>
  );
};

export default ConfirmPhase;

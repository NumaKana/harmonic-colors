import { Key, Chord, Section } from '../types';
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
  hueRotation: number;
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
  hueRotation
}: ConfirmPhaseProps) => {
  return (
    <div className="confirm-phase">
      <ChordNameBar
        chords={allChords}
        playbackPosition={playbackPosition}
        bpm={bpm}
      />
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
        hueRotation={hueRotation}
      />
    </div>
  );
};

export default ConfirmPhase;

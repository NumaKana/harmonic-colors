import { Key, Chord } from '../types';
import VisualizationCanvas from './VisualizationCanvas';
import ChordNameBar from './ChordNameBar';
import './ConfirmPhase.css';

interface ConfirmPhaseProps {
  selectedKey: Key;
  currentChord?: Chord;
  chordProgression: Chord[];
  currentChordIndex: number;
  playbackPosition: number;
  bpm: number;
  metronomeEnabled: boolean;
  timeSignature: number;
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange: (position: number) => void;
}

const ConfirmPhase = ({
  selectedKey,
  currentChord,
  chordProgression,
  currentChordIndex,
  playbackPosition,
  bpm,
  metronomeEnabled,
  timeSignature,
  onPlayingIndexChange,
  onPlaybackPositionChange
}: ConfirmPhaseProps) => {
  return (
    <div className="confirm-phase">
      <ChordNameBar
        chords={chordProgression}
        playbackPosition={playbackPosition}
        bpm={bpm}
      />
      <VisualizationCanvas
        selectedKey={selectedKey}
        currentChord={currentChord}
        chordProgression={chordProgression}
        currentChordIndex={currentChordIndex}
        playbackPosition={playbackPosition}
        bpm={bpm}
        metronomeEnabled={metronomeEnabled}
        timeSignature={timeSignature}
        onPlayingIndexChange={onPlayingIndexChange}
        onPlaybackPositionChange={onPlaybackPositionChange}
      />
    </div>
  );
};

export default ConfirmPhase;

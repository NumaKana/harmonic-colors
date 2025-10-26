import { Key, Chord } from '../types';
import KeySelector from './KeySelector';
import ChordPalette from './ChordPalette';
import ChordSequence from './ChordSequence';
import PlaybackControls from './PlaybackControls';
import VisualizationPreview from './VisualizationPreview';
import './BuildPhase.css';

interface BuildPhaseProps {
  selectedKey: Key;
  onKeyChange: (key: Key) => void;
  chords: Chord[];
  onChordSelect: (chord: Chord) => void;
  onRemoveChord: (index: number) => void;
  onSelectChord: (index: number) => void;
  currentIndex?: number;
  selectedIndex?: number;
  timeSignature: number;
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange: (position: number) => void;
  onTimeSignatureChange: (timeSignature: number) => void;
  onBpmChange: (bpm: number) => void;
  onMetronomeChange: (enabled: boolean) => void;
}

const BuildPhase = ({
  selectedKey,
  onKeyChange,
  chords,
  onChordSelect,
  onRemoveChord,
  onSelectChord,
  currentIndex,
  selectedIndex,
  timeSignature,
  onPlayingIndexChange,
  onPlaybackPositionChange,
  onTimeSignatureChange,
  onBpmChange,
  onMetronomeChange
}: BuildPhaseProps) => {
  // Get current chord for preview
  const currentChord = selectedIndex !== undefined && selectedIndex >= 0
    ? chords[selectedIndex]
    : chords.length > 0
    ? chords[chords.length - 1]
    : undefined;

  return (
    <div className="build-phase">
      <KeySelector selectedKey={selectedKey} onKeyChange={onKeyChange} />
      <ChordPalette selectedKey={selectedKey} onChordSelect={onChordSelect} />
      <ChordSequence
        chords={chords}
        onRemoveChord={onRemoveChord}
        onSelectChord={onSelectChord}
        currentIndex={currentIndex}
        selectedIndex={selectedIndex}
        timeSignature={timeSignature}
      />
      <PlaybackControls
        chords={chords}
        onPlayingIndexChange={onPlayingIndexChange}
        onPlaybackPositionChange={onPlaybackPositionChange}
        onTimeSignatureChange={onTimeSignatureChange}
        onBpmChange={onBpmChange}
        onMetronomeChange={onMetronomeChange}
      />
      <VisualizationPreview
        selectedKey={selectedKey}
        currentChord={currentChord}
      />
    </div>
  );
};

export default BuildPhase;

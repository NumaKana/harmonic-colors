import { useState, useEffect } from 'react';
import './App.css';
import KeySelector from './components/KeySelector';
import ChordPalette from './components/ChordPalette';
import ChordSequence from './components/ChordSequence';
import PlaybackControls from './components/PlaybackControls';
import VisualizationCanvas from './components/VisualizationCanvas';
import { Key, Chord } from './types';
import { audioEngine } from './utils/audioEngine';

function App() {
  const [selectedKey, setSelectedKey] = useState<Key>({
    tonic: 'C',
    mode: 'major',
  });
  const [chordProgression, setChordProgression] = useState<Chord[]>([]);
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(-1); // Index of currently playing chord
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null); // Index of user-selected chord
  const [timeSignature, setTimeSignature] = useState<number>(4);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0); // Current playback position in beats
  const [bpm, setBpm] = useState<number>(120);
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(false);

  const handleAddChord = (chord: Chord) => {
    const newProgression = [...chordProgression, chord];
    setChordProgression(newProgression);
    // Auto-select the newly added chord
    setSelectedChordIndex(newProgression.length - 1);
  };

  const handleRemoveChord = (index: number) => {
    setChordProgression(chordProgression.filter((_, i) => i !== index));
    // Reset current chord index if removed
    if (currentChordIndex === index) {
      setCurrentChordIndex(-1);
    } else if (currentChordIndex >= 0 && index < currentChordIndex) {
      setCurrentChordIndex(currentChordIndex - 1);
    }
    // Reset selected chord index if removed
    if (selectedChordIndex === index) {
      setSelectedChordIndex(null);
    } else if (selectedChordIndex !== null && index < selectedChordIndex) {
      setSelectedChordIndex(selectedChordIndex - 1);
    }
  };

  const handleSelectChord = (index: number) => {
    setSelectedChordIndex(index);
  };

  const handlePlayingIndexChange = (index: number) => {
    setCurrentChordIndex(index);
    if (index === -1) {
      setPlaybackPosition(0);
    }
  };

  const handlePlaybackPositionChange = (position: number) => {
    setPlaybackPosition(position);
  };

  // Get current chord for visualization
  // Priority: 1. Playing chord, 2. Selected chord, 3. Last chord
  const currentChord = currentChordIndex >= 0
    ? chordProgression[currentChordIndex]
    : selectedChordIndex !== null && selectedChordIndex >= 0
    ? chordProgression[selectedChordIndex]
    : chordProgression.length > 0
    ? chordProgression[chordProgression.length - 1]
    : undefined;

  // Cleanup audio engine on unmount
  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Harmonic Colors</h1>
      </header>
      <main className="main">
        <div className="controls-section">
          <KeySelector selectedKey={selectedKey} onKeyChange={setSelectedKey} />
          <ChordPalette selectedKey={selectedKey} onChordSelect={handleAddChord} />
          <PlaybackControls
            chords={chordProgression}
            onPlayingIndexChange={handlePlayingIndexChange}
            onPlaybackPositionChange={handlePlaybackPositionChange}
            onTimeSignatureChange={setTimeSignature}
            onBpmChange={setBpm}
            onMetronomeChange={setMetronomeEnabled}
          />
        </div>
        <div className="visualization-section">
          <VisualizationCanvas
            selectedKey={selectedKey}
            currentChord={currentChord}
            chordProgression={chordProgression}
            currentChordIndex={currentChordIndex}
            playbackPosition={playbackPosition}
            bpm={bpm}
            metronomeEnabled={metronomeEnabled}
            timeSignature={timeSignature}
            onPlayingIndexChange={handlePlayingIndexChange}
            onPlaybackPositionChange={handlePlaybackPositionChange}
          />
          <ChordSequence
            chords={chordProgression}
            onRemoveChord={handleRemoveChord}
            onSelectChord={handleSelectChord}
            currentIndex={currentChordIndex >= 0 ? currentChordIndex : undefined}
            selectedIndex={selectedChordIndex !== null ? selectedChordIndex : undefined}
            timeSignature={timeSignature}
          />
        </div>
      </main>
    </div>
  )
}

export default App

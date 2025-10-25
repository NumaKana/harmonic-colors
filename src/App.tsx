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
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(-1);

  const handleAddChord = (chord: Chord) => {
    setChordProgression([...chordProgression, chord]);
  };

  const handleRemoveChord = (index: number) => {
    setChordProgression(chordProgression.filter((_, i) => i !== index));
    // Reset current chord index if removed
    if (currentChordIndex === index) {
      setCurrentChordIndex(-1);
    } else if (currentChordIndex >= 0 && index < currentChordIndex) {
      setCurrentChordIndex(currentChordIndex - 1);
    }
  };

  const handlePlayingIndexChange = (index: number) => {
    setCurrentChordIndex(index);
  };

  // Get current chord for visualization
  const currentChord = currentChordIndex >= 0
    ? chordProgression[currentChordIndex]
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
          />
          <ChordSequence
            chords={chordProgression}
            onRemoveChord={handleRemoveChord}
            currentIndex={currentChordIndex >= 0 ? currentChordIndex : undefined}
          />
        </div>
        <div className="visualization-section">
          <VisualizationCanvas
            selectedKey={selectedKey}
            currentChord={currentChord}
          />
        </div>
      </main>
    </div>
  )
}

export default App

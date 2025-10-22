import { useState } from 'react';
import './App.css';
import KeySelector from './components/KeySelector';
import ChordPalette from './components/ChordPalette';
import ChordSequence from './components/ChordSequence';
import VisualizationCanvas from './components/VisualizationCanvas';
import { Key, Chord } from './types';

function App() {
  const [selectedKey, setSelectedKey] = useState<Key>({
    tonic: 'C',
    mode: 'major',
  });
  const [chordProgression, setChordProgression] = useState<Chord[]>([]);
  const [currentChordIndex, setCurrentChordIndex] = useState<number | undefined>(undefined);

  const handleAddChord = (chord: Chord) => {
    setChordProgression([...chordProgression, chord]);
  };

  const handleRemoveChord = (index: number) => {
    setChordProgression(chordProgression.filter((_, i) => i !== index));
    // Reset current chord index if removed
    if (currentChordIndex === index) {
      setCurrentChordIndex(undefined);
    } else if (currentChordIndex !== undefined && index < currentChordIndex) {
      setCurrentChordIndex(currentChordIndex - 1);
    }
  };

  // Get current chord for visualization
  const currentChord = currentChordIndex !== undefined
    ? chordProgression[currentChordIndex]
    : chordProgression.length > 0
    ? chordProgression[chordProgression.length - 1]
    : undefined;

  return (
    <div className="app">
      <header className="header">
        <h1>Harmonic Colors</h1>
      </header>
      <main className="main">
        <div className="controls-section">
          <KeySelector selectedKey={selectedKey} onKeyChange={setSelectedKey} />
          <ChordPalette selectedKey={selectedKey} onChordSelect={handleAddChord} />
          <ChordSequence
            chords={chordProgression}
            onRemoveChord={handleRemoveChord}
            currentIndex={currentChordIndex}
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

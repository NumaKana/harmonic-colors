import { useState } from 'react';
import './App.css';
import KeySelector from './components/KeySelector';
import ChordPalette from './components/ChordPalette';
import ChordSequence from './components/ChordSequence';
import { Key, Chord } from './types';

function App() {
  const [selectedKey, setSelectedKey] = useState<Key>({
    tonic: 'C',
    mode: 'major',
  });
  const [chordProgression, setChordProgression] = useState<Chord[]>([]);

  const handleAddChord = (chord: Chord) => {
    setChordProgression([...chordProgression, chord]);
  };

  const handleRemoveChord = (index: number) => {
    setChordProgression(chordProgression.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Harmonic Colors</h1>
      </header>
      <main className="main">
        <div className="controls-section">
          <KeySelector selectedKey={selectedKey} onKeyChange={setSelectedKey} />
          <ChordPalette selectedKey={selectedKey} onChordSelect={handleAddChord} />
          <ChordSequence chords={chordProgression} onRemoveChord={handleRemoveChord} />
        </div>
      </main>
    </div>
  )
}

export default App

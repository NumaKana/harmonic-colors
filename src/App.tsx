import { useState } from 'react';
import './App.css';
import KeySelector from './components/KeySelector';
import { Key } from './types';

function App() {
  const [selectedKey, setSelectedKey] = useState<Key>({
    tonic: 'C',
    mode: 'major',
  });

  return (
    <div className="app">
      <header className="header">
        <h1>Harmonic Colors</h1>
      </header>
      <main className="main">
        <div className="controls-section">
          <KeySelector selectedKey={selectedKey} onKeyChange={setSelectedKey} />
        </div>
        <div className="info-section">
          <p>Current Key: {selectedKey.tonic} {selectedKey.mode}</p>
        </div>
      </main>
    </div>
  )
}

export default App

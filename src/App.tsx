import { useState, useEffect } from 'react';
import './App.css';
import BuildPhase from './components/BuildPhase';
import ConfirmPhase from './components/ConfirmPhase';
import SettingsSidebar from './components/SettingsSidebar';
import { Key, Chord, Section } from './types';
import { audioEngine } from './utils/audioEngine';

type Phase = 'build' | 'confirm';

const HUE_ROTATION_STORAGE_KEY = 'harmonic-colors-hue-rotation';

function App() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('build');

  // Section-based data structure (Phase 4)
  const [sections, setSections] = useState<Section[]>([{
    id: '1',
    name: 'Section 1',
    key: { tonic: 'C', mode: 'major' },
    chords: []
  }]);
  const [currentSectionId, setCurrentSectionId] = useState<string>('1');

  const [currentChordIndex, setCurrentChordIndex] = useState<number>(-1); // Index of currently playing chord
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null); // Index of user-selected chord
  const [timeSignature, setTimeSignature] = useState<number>(4);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0); // Current playback position in beats
  const [bpm, setBpm] = useState<number>(120);
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(false);

  // Derived values for backward compatibility
  const currentSection = sections.find(s => s.id === currentSectionId) || sections[0];
  const selectedKey = currentSection.key;
  const chordProgression = currentSection.chords;

  // Load hueRotation from LocalStorage
  const [hueRotation, setHueRotation] = useState<number>(() => {
    const saved = localStorage.getItem(HUE_ROTATION_STORAGE_KEY);
    return saved !== null ? Number(saved) : 0;
  });

  // Settings sidebar state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleAddChord = (chord: Chord) => {
    setSections(sections.map(section => {
      if (section.id === currentSectionId) {
        const newChords = [...section.chords, chord];
        // Auto-select the newly added chord
        setSelectedChordIndex(newChords.length - 1);
        return { ...section, chords: newChords };
      }
      return section;
    }));
  };

  const handleRemoveChord = (index: number) => {
    setSections(sections.map(section => {
      if (section.id === currentSectionId) {
        return {
          ...section,
          chords: section.chords.filter((_, i) => i !== index)
        };
      }
      return section;
    }));

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

  const handleKeyChange = (newKey: Key) => {
    setSections(sections.map(section => {
      if (section.id === currentSectionId) {
        return { ...section, key: newKey };
      }
      return section;
    }));
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

  const handleHueRotationChange = (rotation: number) => {
    setHueRotation(rotation);
    localStorage.setItem(HUE_ROTATION_STORAGE_KEY, String(rotation));
  };

  // Section management handlers
  const handleSectionAdd = () => {
    const newId = String(Date.now());
    const newSection: Section = {
      id: newId,
      name: `Section ${sections.length + 1}`,
      key: { tonic: 'C', mode: 'major' },
      chords: []
    };
    setSections([...sections, newSection]);
    setCurrentSectionId(newId);
  };

  const handleSectionRemove = (id: string) => {
    if (sections.length <= 1) return; // Don't remove the last section
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    if (currentSectionId === id) {
      setCurrentSectionId(newSections[0].id);
    }
  };

  const handleSectionNameChange = (id: string, name: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, name } : section
    ));
  };

  const handleSectionKeyChange = (id: string, key: Key) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, key } : section
    ));
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
        <div className="phase-tabs">
          <button
            className={`phase-tab ${currentPhase === 'build' ? 'active' : ''}`}
            onClick={() => setCurrentPhase('build')}
          >
            組み立て
          </button>
          <button
            className={`phase-tab ${currentPhase === 'confirm' ? 'active' : ''}`}
            onClick={() => setCurrentPhase('confirm')}
          >
            確認
          </button>
        </div>
        <button
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          title="Open settings"
        >
          ⚙
        </button>
      </header>
      <main className="main">
        {currentPhase === 'build' ? (
          <BuildPhase
            selectedKey={selectedKey}
            chords={chordProgression}
            onChordSelect={handleAddChord}
            onRemoveChord={handleRemoveChord}
            onSelectChord={handleSelectChord}
            currentIndex={currentChordIndex >= 0 ? currentChordIndex : undefined}
            selectedIndex={selectedChordIndex !== null ? selectedChordIndex : undefined}
            timeSignature={timeSignature}
            onPlayingIndexChange={handlePlayingIndexChange}
            onPlaybackPositionChange={handlePlaybackPositionChange}
            onTimeSignatureChange={setTimeSignature}
            onBpmChange={setBpm}
            onMetronomeChange={setMetronomeEnabled}
            hueRotation={hueRotation}
            sections={sections}
            currentSectionId={currentSectionId}
            onSectionSelect={setCurrentSectionId}
            onSectionAdd={handleSectionAdd}
            onSectionRemove={handleSectionRemove}
            onSectionNameChange={handleSectionNameChange}
            onSectionKeyChange={handleSectionKeyChange}
          />
        ) : (
          <ConfirmPhase
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
            hueRotation={hueRotation}
          />
        )}
      </main>

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hueRotation={hueRotation}
        onHueRotationChange={handleHueRotationChange}
        selectedKey={selectedKey}
      />
    </div>
  )
}

export default App

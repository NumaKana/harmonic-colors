import { useState, useEffect } from 'react';
import './App.css';
import BuildPhase from './components/BuildPhase';
import ConfirmPhase from './components/ConfirmPhase';
import SettingsSidebar from './components/SettingsSidebar';
import HelpModal from './components/HelpModal';
import { Key, Chord, Section, MinorScaleType, VisualizationStyle } from './types';
import { audioEngine } from './utils/audioEngine';
import { getSampleSong } from './data/samples';

type Phase = 'build' | 'confirm';

const MAJOR_HUE_ROTATION_STORAGE_KEY = 'harmonic-colors-major-hue-rotation';
const MINOR_HUE_ROTATION_STORAGE_KEY = 'harmonic-colors-minor-hue-rotation';
const MINOR_SCALE_TYPE_STORAGE_KEY = 'harmonic-colors-minor-scale-type';
const VISUALIZATION_STYLE_STORAGE_KEY = 'harmonic-colors-visualization-style';

// Legacy key for migration
const LEGACY_HUE_ROTATION_STORAGE_KEY = 'harmonic-colors-hue-rotation';

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
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(true);

  // Derived values for backward compatibility
  const currentSection = sections.find(s => s.id === currentSectionId) || sections[0];
  const selectedKey = currentSection.key;
  const chordProgression = currentSection.chords;

  // All chords from all sections for full playback
  const allChords = sections.flatMap(section => section.chords);

  // Load majorHueRotation and minorHueRotation from LocalStorage with migration
  const [majorHueRotation, setMajorHueRotation] = useState<number>(() => {
    // Try to load major hue rotation
    const savedMajor = localStorage.getItem(MAJOR_HUE_ROTATION_STORAGE_KEY);
    if (savedMajor !== null) {
      return Number(savedMajor);
    }

    // Migration: check for legacy hueRotation
    const legacyRotation = localStorage.getItem(LEGACY_HUE_ROTATION_STORAGE_KEY);
    if (legacyRotation !== null) {
      const rotation = Number(legacyRotation);
      localStorage.setItem(MAJOR_HUE_ROTATION_STORAGE_KEY, String(rotation));
      return rotation;
    }

    return 0;
  });

  const [minorHueRotation, setMinorHueRotation] = useState<number>(() => {
    // Try to load minor hue rotation
    const savedMinor = localStorage.getItem(MINOR_HUE_ROTATION_STORAGE_KEY);
    if (savedMinor !== null) {
      return Number(savedMinor);
    }

    // Migration: check for legacy hueRotation
    const legacyRotation = localStorage.getItem(LEGACY_HUE_ROTATION_STORAGE_KEY);
    if (legacyRotation !== null) {
      const rotation = Number(legacyRotation);
      localStorage.setItem(MINOR_HUE_ROTATION_STORAGE_KEY, String(rotation));
      // Remove legacy key after migration
      localStorage.removeItem(LEGACY_HUE_ROTATION_STORAGE_KEY);
      return rotation;
    }

    return 90; // Default to 90° for relative minor alignment (e.g., C major and A minor)
  });

  // Load minorScaleType from LocalStorage (default: melodic)
  const [minorScaleType, setMinorScaleType] = useState<MinorScaleType>(() => {
    const saved = localStorage.getItem(MINOR_SCALE_TYPE_STORAGE_KEY);
    return (saved as MinorScaleType) || 'melodic';
  });

  // Load visualizationStyle from LocalStorage (default: marble)
  const [visualizationStyle, setVisualizationStyle] = useState<VisualizationStyle>(() => {
    const saved = localStorage.getItem(VISUALIZATION_STYLE_STORAGE_KEY);
    return (saved as VisualizationStyle) || 'marble';
  });

  // Settings sidebar state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Help modal state
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const handleAddChord = (chord: Chord) => {
    // Calculate the global index for the new chord
    let globalIndex = 0;
    for (const section of sections) {
      if (section.id === currentSectionId) {
        globalIndex += section.chords.length; // Position after all chords in current section
        break;
      }
      globalIndex += section.chords.length;
    }

    setSections(sections.map(section => {
      if (section.id === currentSectionId) {
        // Add sectionId to the chord
        const chordWithSection = { ...chord, sectionId: section.id };
        const newChords = [...section.chords, chordWithSection];
        return { ...section, chords: newChords };
      }
      return section;
    }));

    // Auto-select the newly added chord with global index
    setSelectedChordIndex(globalIndex);
  };

  const handleRemoveChord = (globalIndex: number) => {
    // Find which section contains the chord at this global index
    let currentGlobalIndex = 0;
    let targetSectionId: string | null = null;
    let localIndex = -1;

    for (const section of sections) {
      if (globalIndex < currentGlobalIndex + section.chords.length) {
        targetSectionId = section.id;
        localIndex = globalIndex - currentGlobalIndex;
        break;
      }
      currentGlobalIndex += section.chords.length;
    }

    if (targetSectionId === null) return; // Invalid index

    // Remove chord from the target section
    setSections(sections.map(section => {
      if (section.id === targetSectionId) {
        return {
          ...section,
          chords: section.chords.filter((_, i) => i !== localIndex)
        };
      }
      return section;
    }));

    // Reset current chord index if removed (using global index)
    if (currentChordIndex === globalIndex) {
      setCurrentChordIndex(-1);
    } else if (currentChordIndex >= 0 && globalIndex < currentChordIndex) {
      setCurrentChordIndex(currentChordIndex - 1);
    }
    // Reset selected chord index if removed (using global index)
    if (selectedChordIndex === globalIndex) {
      setSelectedChordIndex(null);
    } else if (selectedChordIndex !== null && globalIndex < selectedChordIndex) {
      setSelectedChordIndex(selectedChordIndex - 1);
    }
  };

  const handleSelectChord = (index: number) => {
    setSelectedChordIndex(index);

    // Find which section contains this chord and switch to it
    let currentGlobalIndex = 0;
    for (const section of sections) {
      if (index < currentGlobalIndex + section.chords.length) {
        // This section contains the selected chord
        if (currentSectionId !== section.id) {
          setCurrentSectionId(section.id);
        }
        break;
      }
      currentGlobalIndex += section.chords.length;
    }
  };

  const handleUpdateChord = (globalIndex: number, updatedChord: Chord) => {
    // Find which section contains the chord at this global index
    let currentGlobalIndex = 0;
    let targetSectionId: string | null = null;
    let localIndex = -1;

    for (const section of sections) {
      if (globalIndex < currentGlobalIndex + section.chords.length) {
        targetSectionId = section.id;
        localIndex = globalIndex - currentGlobalIndex;
        break;
      }
      currentGlobalIndex += section.chords.length;
    }

    if (targetSectionId === null) return; // Invalid index

    setSections(sections.map(section => {
      if (section.id === targetSectionId) {
        return {
          ...section,
          chords: section.chords.map((chord, i) =>
            i === localIndex ? { ...updatedChord, sectionId: section.id } : chord
          )
        };
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

  const handleMajorHueRotationChange = (rotation: number) => {
    setMajorHueRotation(rotation);
    localStorage.setItem(MAJOR_HUE_ROTATION_STORAGE_KEY, String(rotation));
  };

  const handleMinorHueRotationChange = (rotation: number) => {
    setMinorHueRotation(rotation);
    localStorage.setItem(MINOR_HUE_ROTATION_STORAGE_KEY, String(rotation));
  };

  const handleMinorScaleTypeChange = (scaleType: MinorScaleType) => {
    setMinorScaleType(scaleType);
    localStorage.setItem(MINOR_SCALE_TYPE_STORAGE_KEY, scaleType);
  };

  const handleVisualizationStyleChange = (style: VisualizationStyle) => {
    setVisualizationStyle(style);
    localStorage.setItem(VISUALIZATION_STYLE_STORAGE_KEY, style);
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

  const handleLoadSample = (sampleId: string) => {
    const sample = getSampleSong(sampleId);
    if (!sample) {
      console.error(`Sample song not found: ${sampleId}`);
      return;
    }

    // Confirm before overwriting current progression
    const message = `現在のコード進行を「${sample.title}」で上書きしますか？`;
    if (window.confirm(message)) {
      // Add sectionId to each chord
      const sectionsWithIds = sample.sections.map(section => ({
        ...section,
        chords: section.chords.map(chord => ({
          ...chord,
          sectionId: section.id
        }))
      }));

      setSections(sectionsWithIds);
      setCurrentSectionId(sample.sections[0].id);
      setSelectedChordIndex(null);
      setCurrentChordIndex(-1);
      setPlaybackPosition(0);

      // Apply BPM if specified
      if (sample.bpm) {
        setBpm(sample.bpm);
      }
    }
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

  // Convert global selected index to local index for current section
  const getLocalSelectedIndex = (): number | undefined => {
    if (selectedChordIndex === null) return undefined;

    let currentGlobalIndex = 0;
    for (const section of sections) {
      if (section.id === currentSectionId) {
        const localIndex = selectedChordIndex - currentGlobalIndex;
        // Check if the selected chord belongs to this section
        if (localIndex >= 0 && localIndex < section.chords.length) {
          return localIndex;
        }
        return undefined; // Selected chord is not in current section
      }
      currentGlobalIndex += section.chords.length;
    }
    return undefined;
  };

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
        <div className="header-buttons">
          <button
            className="help-button"
            onClick={() => setIsHelpOpen(true)}
            title="ヘルプ / Help"
          >
            i
          </button>
          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            title="設定 / Settings"
          >
            ⚙
          </button>
        </div>
      </header>
      <main className="main">
        {currentPhase === 'build' ? (
          <BuildPhase
            selectedKey={selectedKey}
            chords={chordProgression}
            allChords={allChords}
            onChordSelect={handleAddChord}
            onRemoveChord={handleRemoveChord}
            onSelectChord={handleSelectChord}
            onUpdateChord={handleUpdateChord}
            currentIndex={currentChordIndex >= 0 ? currentChordIndex : undefined}
            selectedIndex={selectedChordIndex !== null ? selectedChordIndex : undefined}
            localSelectedIndex={getLocalSelectedIndex()}
            timeSignature={timeSignature}
            onPlayingIndexChange={handlePlayingIndexChange}
            onPlaybackPositionChange={handlePlaybackPositionChange}
            onTimeSignatureChange={setTimeSignature}
            onBpmChange={setBpm}
            onMetronomeChange={setMetronomeEnabled}
            metronomeEnabled={metronomeEnabled}
            majorHueRotation={majorHueRotation}
            minorHueRotation={minorHueRotation}
            minorScaleType={minorScaleType}
            visualizationStyle={visualizationStyle}
            sections={sections}
            currentSectionId={currentSectionId}
            onSectionSelect={setCurrentSectionId}
            onSectionAdd={handleSectionAdd}
            onSectionRemove={handleSectionRemove}
            onSectionNameChange={handleSectionNameChange}
            onSectionKeyChange={handleSectionKeyChange}
            onLoadSample={handleLoadSample}
          />
        ) : (
          <ConfirmPhase
            selectedKey={selectedKey}
            currentChord={currentChord}
            chordProgression={chordProgression}
            allChords={allChords}
            sections={sections}
            currentChordIndex={currentChordIndex}
            playbackPosition={playbackPosition}
            bpm={bpm}
            metronomeEnabled={metronomeEnabled}
            timeSignature={timeSignature}
            onPlayingIndexChange={handlePlayingIndexChange}
            onPlaybackPositionChange={handlePlaybackPositionChange}
            majorHueRotation={majorHueRotation}
            minorHueRotation={minorHueRotation}
            minorScaleType={minorScaleType}
            visualizationStyle={visualizationStyle}
          />
        )}
      </main>

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        majorHueRotation={majorHueRotation}
        minorHueRotation={minorHueRotation}
        onMajorHueRotationChange={handleMajorHueRotationChange}
        onMinorHueRotationChange={handleMinorHueRotationChange}
        selectedKey={selectedKey}
        minorScaleType={minorScaleType}
        onMinorScaleTypeChange={handleMinorScaleTypeChange}
        visualizationStyle={visualizationStyle}
        onVisualizationStyleChange={handleVisualizationStyleChange}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}

export default App

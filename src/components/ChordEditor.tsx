import { useState } from 'react';
import { Chord, Note, ChordQuality, SeventhType, Tension, Alteration } from '../types';
import './ChordEditor.css';

interface ChordEditorProps {
  initialRoot?: Note;
  initialQuality?: ChordQuality;
  initialDuration?: number;
  onChordCreate: (chord: Chord, duration: number) => void;
  onCancel: () => void;
  isDiatonicEdit?: boolean; // True when editing a diatonic chord from palette
}

type NoteDuration = 4 | 3 | 2 | 1.5 | 1 | 0.75 | 0.5;

const DURATION_OPTIONS: { value: NoteDuration; label: string; symbol: string }[] = [
  { value: 4, label: 'Whole Note', symbol: '𝅝' },
  { value: 3, label: 'Dotted Half Note', symbol: '𝅗𝅥.' },
  { value: 2, label: 'Half Note', symbol: '𝅗𝅥' },
  { value: 1.5, label: 'Dotted Quarter Note', symbol: '♩.' },
  { value: 1, label: 'Quarter Note', symbol: '♩' },
  { value: 0.75, label: 'Dotted Eighth Note', symbol: '♪.' },
  { value: 0.5, label: 'Eighth Note', symbol: '♪' },
];

// Seventh options based on quality
const SEVENTH_OPTIONS_BY_QUALITY: Record<ChordQuality, { value: SeventhType | null; label: string }[]> = {
  major: [
    { value: null, label: 'None' },
    { value: '7', label: 'Dom7' },
    { value: 'maj7', label: 'Maj7' },
  ],
  minor: [
    { value: null, label: 'None' },
    { value: 'm7', label: 'm7' },
    { value: 'mMaj7', label: 'mMaj7' },
  ],
  diminished: [
    { value: null, label: 'None' },
    { value: 'm7b5', label: 'm7♭5' },
    { value: 'dim7', label: 'dim7' },
  ],
  augmented: [
    { value: null, label: 'None' },
    { value: 'aug7', label: 'aug7' },
    { value: 'augMaj7', label: 'augMaj7' },
  ],
};

const TENSION_OPTIONS: Tension[] = [9, 11, 13];
const ALTERATION_OPTIONS: Alteration[] = ['b9', '#9', '#11', 'b13'];

const ALL_NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ALL_QUALITIES: ChordQuality[] = ['major', 'minor', 'diminished', 'augmented'];

// Diatonic quality variations: For each diatonic quality, what alternatives are musically valid?
// For example, I can be major or augmented, ii can be minor or diminished, etc.
const DIATONIC_QUALITY_VARIATIONS: Record<ChordQuality, ChordQuality[]> = {
  major: ['major', 'augmented'], // I can be I or Iaug
  minor: ['minor', 'diminished'], // ii, iii, vi can have variations
  diminished: ['diminished', 'minor'], // vii° can be vii° or viim
  augmented: ['augmented', 'major'], // rare, but allow both
};

const ChordEditor = ({ initialRoot, initialQuality, initialDuration, onChordCreate, onCancel, isDiatonicEdit = false }: ChordEditorProps) => {
  const [root, setRoot] = useState<Note>(initialRoot || 'C');
  const [quality, setQuality] = useState<ChordQuality>(initialQuality || 'major');
  const [seventh, setSeventh] = useState<SeventhType | null>(null);
  const [tensions, setTensions] = useState<Tension[]>([]);
  const [alterations, setAlterations] = useState<Alteration[]>([]);
  const [duration, setDuration] = useState<NoteDuration>((initialDuration as NoteDuration) || 4);

  // Get available qualities based on mode
  const availableQualities = isDiatonicEdit && initialQuality
    ? DIATONIC_QUALITY_VARIATIONS[initialQuality]
    : ALL_QUALITIES;

  // Get available seventh options based on current quality
  const availableSeventhOptions = SEVENTH_OPTIONS_BY_QUALITY[quality];

  // Reset seventh if it's not available for the new quality
  const handleQualityChange = (newQuality: ChordQuality) => {
    setQuality(newQuality);
    const newAvailableOptions = SEVENTH_OPTIONS_BY_QUALITY[newQuality];
    const isSeventhAvailable = newAvailableOptions.some(opt => opt.value === seventh);
    if (!isSeventhAvailable) {
      setSeventh(null);
    }
  };

  const toggleTension = (tension: Tension) => {
    setTensions((prev) =>
      prev.includes(tension)
        ? prev.filter((t) => t !== tension)
        : [...prev, tension].sort()
    );
  };

  const toggleAlteration = (alteration: Alteration) => {
    setAlterations((prev) =>
      prev.includes(alteration)
        ? prev.filter((a) => a !== alteration)
        : [...prev, alteration]
    );
  };

  const handleCreate = () => {
    const chord: Chord = {
      root,
      quality,
      seventh: seventh || undefined,
      tensions,
      alterations,
      duration,
    };
    onChordCreate(chord, duration);
  };

  // Generate chord display name
  const getChordName = () => {
    let name = root;

    // Seventh determines the full chord type
    if (seventh) {
      if (seventh === '7') {
        // Dominant 7th: C7
        name += '7';
      } else if (seventh === 'maj7') {
        // Major 7th: Cmaj7
        name += 'maj7';
      } else if (seventh === 'm7') {
        // Minor 7th: Cm7
        name += 'm7';
      } else if (seventh === 'mMaj7') {
        // Minor major 7th: CmMaj7
        name += 'mMaj7';
      } else if (seventh === 'm7b5') {
        // Half-diminished: Cm7♭5
        name += 'm7♭5';
      } else if (seventh === 'dim7') {
        // Diminished 7th: Cdim7
        name += 'dim7';
      } else if (seventh === 'aug7') {
        // Augmented 7th: Caug7
        name += 'aug7';
      } else if (seventh === 'augMaj7') {
        // Augmented major 7th: CaugMaj7
        name += 'augMaj7';
      }
    } else {
      // No seventh - use quality
      if (quality === 'minor') name += 'm';
      else if (quality === 'diminished') name += 'dim';
      else if (quality === 'augmented') name += 'aug';
    }

    // Tensions
    if (tensions.length > 0) {
      name += '(' + tensions.join(',') + ')';
    }

    // Alterations
    if (alterations.length > 0) {
      name += '(' + alterations.join(',') + ')';
    }

    return name;
  };

  return (
    <div className="chord-editor-overlay" onClick={onCancel}>
      <div className="chord-editor" onClick={(e) => e.stopPropagation()}>
        <div className="chord-editor-header">
          <h3 className="chord-editor-title">Chord Editor</h3>
          <button className="chord-editor-close" onClick={onCancel} title="Close">
            ✕
          </button>
        </div>

        <div className="chord-editor-content">
          {/* Chord Preview */}
          <div className="chord-preview">
            <div className="chord-preview-label">Chord:</div>
            <div className="chord-preview-name">{getChordName()}</div>
          </div>

          {/* Root Selection - Only show if not editing diatonic chord */}
          {!isDiatonicEdit && (
            <div className="editor-section">
              <h4 className="section-title">Root</h4>
              <div className="button-group">
                {ALL_NOTES.map((note) => (
                  <button
                    key={note}
                    className={`option-button ${root === note ? 'active' : ''}`}
                    onClick={() => setRoot(note)}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Root Display - Show fixed root when editing diatonic chord */}
          {isDiatonicEdit && (
            <div className="editor-section">
              <h4 className="section-title">Root</h4>
              <div className="chord-preview-name" style={{ fontSize: '1.5rem', padding: '0.5rem' }}>
                {root}
              </div>
            </div>
          )}

          {/* Quality Selection */}
          <div className="editor-section">
            <h4 className="section-title">Quality</h4>
            <div className="button-group">
              {availableQualities.map((q) => (
                <button
                  key={q}
                  className={`option-button ${quality === q ? 'active' : ''}`}
                  onClick={() => handleQualityChange(q)}
                >
                  {q === 'major' ? 'Major' : q === 'minor' ? 'Minor' : q === 'diminished' ? 'Dim' : 'Aug'}
                </button>
              ))}
            </div>
          </div>

          {/* Seventh Selection */}
          <div className="editor-section">
            <h4 className="section-title">Seventh</h4>
            <div className="button-group">
              {availableSeventhOptions.map((option) => (
                <button
                  key={option.label}
                  className={`option-button ${seventh === option.value ? 'active' : ''}`}
                  onClick={() => setSeventh(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tension Selection */}
          <div className="editor-section">
            <h4 className="section-title">Tensions</h4>
            <div className="button-group">
              {TENSION_OPTIONS.map((tension) => (
                <button
                  key={tension}
                  className={`option-button ${tensions.includes(tension) ? 'active' : ''}`}
                  onClick={() => toggleTension(tension)}
                >
                  {tension}th
                </button>
              ))}
            </div>
          </div>

          {/* Alteration Selection */}
          <div className="editor-section">
            <h4 className="section-title">Alterations</h4>
            <div className="button-group">
              {ALTERATION_OPTIONS.map((alteration) => (
                <button
                  key={alteration}
                  className={`option-button ${alterations.includes(alteration) ? 'active' : ''}`}
                  onClick={() => toggleAlteration(alteration)}
                >
                  {alteration}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="editor-section">
            <h4 className="section-title">Duration</h4>
            <select
              className="duration-select"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) as NoteDuration)}
            >
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.symbol} {option.label} ({option.value} beats)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="chord-editor-footer">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="create-button" onClick={handleCreate}>
            Add Chord
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChordEditor;

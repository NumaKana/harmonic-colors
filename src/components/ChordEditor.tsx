import { useState } from 'react';
import { Chord, Note, ChordQuality, SeventhType, Tension, Alteration } from '../types';
import './ChordEditor.css';

interface ChordEditorProps {
  root: Note;
  quality: ChordQuality;
  onChordCreate: (chord: Chord, duration: number) => void;
  onCancel: () => void;
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

const SEVENTH_OPTIONS: { value: SeventhType | null; label: string }[] = [
  { value: null, label: 'None' },
  { value: '7', label: 'Dom7' },
  { value: 'maj7', label: 'Maj7' },
  { value: 'm7', label: 'm7' },
  { value: 'm7b5', label: 'm7♭5' },
  { value: 'dim7', label: 'dim7' },
  { value: 'aug7', label: 'aug7' },
];

const TENSION_OPTIONS: Tension[] = [9, 11, 13];
const ALTERATION_OPTIONS: Alteration[] = ['b9', '#9', '#11', 'b13'];

const ChordEditor = ({ root, quality, onChordCreate, onCancel }: ChordEditorProps) => {
  const [seventh, setSeventh] = useState<SeventhType | null>(null);
  const [tensions, setTensions] = useState<Tension[]>([]);
  const [alterations, setAlterations] = useState<Alteration[]>([]);
  const [duration, setDuration] = useState<NoteDuration>(4);

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

    // Quality
    if (quality === 'minor') name += 'm';
    else if (quality === 'diminished') name += 'dim';
    else if (quality === 'augmented') name += 'aug';

    // Seventh
    if (seventh) {
      if (seventh === '7') name += '7';
      else if (seventh === 'maj7') name += 'maj7';
      else if (seventh === 'm7') name += 'm7';
      else if (seventh === 'm7b5') name += 'm7♭5';
      else if (seventh === 'dim7') name += 'dim7';
      else if (seventh === 'aug7') name += 'aug7';
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

          {/* Seventh Selection */}
          <div className="editor-section">
            <h4 className="section-title">Seventh</h4>
            <div className="button-group">
              {SEVENTH_OPTIONS.map((option) => (
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

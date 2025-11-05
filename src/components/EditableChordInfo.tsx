import { useState, useEffect } from 'react';
import { Chord, Note, ChordQuality, SeventhType, Tension, Alteration } from '../types';
import './EditableChordInfo.css';

interface EditableChordInfoProps {
  chord: Chord;
  chordIndex: number;
  onUpdate: (index: number, chord: Chord) => void;
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

const EditableChordInfo = ({ chord, chordIndex, onUpdate }: EditableChordInfoProps) => {
  const [root, setRoot] = useState<Note>(chord.root);
  const [quality, setQuality] = useState<ChordQuality>(chord.quality);
  const [seventh, setSeventh] = useState<SeventhType | null>(chord.seventh || null);
  const [tensions, setTensions] = useState<Tension[]>(chord.tensions || []);
  const [alterations, setAlterations] = useState<Alteration[]>(chord.alterations || []);
  const [duration, setDuration] = useState<NoteDuration>(chord.duration as NoteDuration);

  // Update local state when chord prop changes
  useEffect(() => {
    setRoot(chord.root);
    setQuality(chord.quality);
    setSeventh(chord.seventh || null);
    setTensions(chord.tensions || []);
    setAlterations(chord.alterations || []);
    setDuration(chord.duration as NoteDuration);
  }, [chord]);

  // Get available seventh options based on current quality
  const availableSeventhOptions = SEVENTH_OPTIONS_BY_QUALITY[quality];

  const handleRootChange = (newRoot: Note) => {
    setRoot(newRoot);
    updateChord({ ...chord, root: newRoot });
  };

  const handleQualityChange = (newQuality: ChordQuality) => {
    setQuality(newQuality);
    const newAvailableOptions = SEVENTH_OPTIONS_BY_QUALITY[newQuality];
    const isSeventhAvailable = newAvailableOptions.some(opt => opt.value === seventh);

    const updatedChord: Chord = {
      ...chord,
      quality: newQuality,
      seventh: isSeventhAvailable ? (seventh || undefined) : undefined
    };

    if (!isSeventhAvailable) {
      setSeventh(null);
    }

    updateChord(updatedChord);
  };

  const handleSeventhChange = (newSeventh: SeventhType | null) => {
    setSeventh(newSeventh);
    updateChord({ ...chord, seventh: newSeventh || undefined });
  };

  const toggleTension = (tension: Tension) => {
    const newTensions = tensions.includes(tension)
      ? tensions.filter((t) => t !== tension)
      : [...tensions, tension].sort();
    setTensions(newTensions);
    updateChord({ ...chord, tensions: newTensions });
  };

  const toggleAlteration = (alteration: Alteration) => {
    const newAlterations = alterations.includes(alteration)
      ? alterations.filter((a) => a !== alteration)
      : [...alterations, alteration];
    setAlterations(newAlterations);
    updateChord({ ...chord, alterations: newAlterations });
  };

  const handleDurationChange = (newDuration: NoteDuration) => {
    setDuration(newDuration);
    updateChord({ ...chord, duration: newDuration });
  };

  const updateChord = (updatedChord: Chord) => {
    onUpdate(chordIndex, updatedChord);
  };

  return (
    <div className="editable-chord-info">
      <h4 className="edit-section-title">Edit Chord</h4>

      {/* Root Selection */}
      <div className="edit-section">
        <label className="edit-label">Root:</label>
        <div className="edit-button-group">
          {ALL_NOTES.map((note) => (
            <button
              key={note}
              className={`edit-button ${root === note ? 'active' : ''}`}
              onClick={() => handleRootChange(note)}
              title={note}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Selection */}
      <div className="edit-section">
        <label className="edit-label">Quality:</label>
        <div className="edit-button-group">
          {ALL_QUALITIES.map((q) => (
            <button
              key={q}
              className={`edit-button ${quality === q ? 'active' : ''}`}
              onClick={() => handleQualityChange(q)}
            >
              {q === 'major' ? 'Major' : q === 'minor' ? 'Minor' : q === 'diminished' ? 'Dim' : 'Aug'}
            </button>
          ))}
        </div>
      </div>

      {/* Seventh Selection */}
      <div className="edit-section">
        <label className="edit-label">Seventh:</label>
        <div className="edit-button-group">
          {availableSeventhOptions.map((option) => (
            <button
              key={option.label}
              className={`edit-button ${seventh === option.value ? 'active' : ''}`}
              onClick={() => handleSeventhChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tension Selection */}
      <div className="edit-section">
        <label className="edit-label">Tensions:</label>
        <div className="edit-button-group">
          {TENSION_OPTIONS.map((tension) => (
            <button
              key={tension}
              className={`edit-button ${tensions.includes(tension) ? 'active' : ''}`}
              onClick={() => toggleTension(tension)}
            >
              {tension}th
            </button>
          ))}
        </div>
      </div>

      {/* Alteration Selection */}
      <div className="edit-section">
        <label className="edit-label">Alterations:</label>
        <div className="edit-button-group">
          {ALTERATION_OPTIONS.map((alteration) => (
            <button
              key={alteration}
              className={`edit-button ${alterations.includes(alteration) ? 'active' : ''}`}
              onClick={() => toggleAlteration(alteration)}
            >
              {alteration}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="edit-section">
        <label className="edit-label">Duration:</label>
        <select
          className="edit-duration-select"
          value={duration}
          onChange={(e) => handleDurationChange(Number(e.target.value) as NoteDuration)}
        >
          {DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.symbol} {option.label} ({option.value} beats)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EditableChordInfo;

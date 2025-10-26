import { Chord } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import './ChordNameBar.css';

interface ChordNameBarProps {
  chords: Chord[];
  playbackPosition: number; // Current playback position in beats
  bpm: number;
}

const ChordNameBar = ({ chords, playbackPosition }: ChordNameBarProps) => {
  if (chords.length === 0) {
    return null;
  }

  // Calculate which chord is currently playing based on playback position
  let accumulatedBeats = 0;
  let currentChordIndex = -1;

  for (let i = 0; i < chords.length; i++) {
    if (playbackPosition >= accumulatedBeats && playbackPosition < accumulatedBeats + chords[i].duration) {
      currentChordIndex = i;
      break;
    }
    accumulatedBeats += chords[i].duration;
  }

  // Calculate positions for visible chords
  const visibleChords: Array<{ chord: Chord; index: number; position: number; isCurrent: boolean }> = [];

  // Show current chord and surrounding chords
  const centerIndex = currentChordIndex >= 0 ? currentChordIndex : 0;
  const startIndex = Math.max(0, centerIndex - 2);
  const endIndex = Math.min(chords.length - 1, centerIndex + 2);

  let beatPosition = 0;
  for (let i = 0; i < chords.length; i++) {
    if (i >= startIndex && i <= endIndex) {
      visibleChords.push({
        chord: chords[i],
        index: i,
        position: beatPosition - playbackPosition,
        isCurrent: i === currentChordIndex
      });
    }
    beatPosition += chords[i].duration;
  }

  return (
    <div className="chord-name-bar">
      <div className="chord-name-bar-track">
        {visibleChords.map(({ chord, index, position, isCurrent }) => (
          <div
            key={index}
            className={`chord-name-item ${isCurrent ? 'current' : ''}`}
            style={{
              transform: `translateX(${position * 50}px)` // 50px per beat
            }}
          >
            {getChordDisplayName(chord)}
          </div>
        ))}
      </div>
      <div className="chord-name-bar-playhead" />
    </div>
  );
};

export default ChordNameBar;

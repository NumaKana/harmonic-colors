import { useState } from 'react';
import { Chord } from '../types';
import { getChordDisplayName } from '../utils/diatonic';
import { audioEngine } from '../utils/audioEngine';
import './ChordSequence.css';

interface ChordSequenceProps {
  chords: Chord[];
  onRemoveChord: (index: number) => void;
  currentIndex?: number;
}

const ChordSequence = ({ chords, onRemoveChord, currentIndex: externalCurrentIndex }: ChordSequenceProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number>(-1);

  const handleChordClick = async (chord: Chord) => {
    await audioEngine.playChord(chord, 2);
  };

  const handlePlayProgression = async () => {
    if (isPlaying) {
      audioEngine.stopProgression();
      setIsPlaying(false);
      setPlayingIndex(-1);
      return;
    }

    setIsPlaying(true);
    await audioEngine.playProgression(chords, 120, (index) => {
      setPlayingIndex(index);
      if (index === -1) {
        setIsPlaying(false);
      }
    });
  };

  const currentIndex = isPlaying ? playingIndex : externalCurrentIndex;

  if (chords.length === 0) {
    return (
      <div className="chord-sequence">
        <h3 className="chord-sequence-title">Chord Progression</h3>
        <div className="chord-sequence-empty">
          No chords added yet. Click on a chord above to add it to the progression.
        </div>
      </div>
    );
  }

  return (
    <div className="chord-sequence">
      <div className="chord-sequence-header">
        <h3 className="chord-sequence-title">
          Chord Progression ({chords.length} chord{chords.length !== 1 ? 's' : ''})
        </h3>
        <button
          className={`progression-play-button ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayProgression}
          title={isPlaying ? 'Stop progression' : 'Play progression'}
        >
          {isPlaying ? '⏸ Stop' : '▶ Play'}
        </button>
      </div>
      <div className="chord-sequence-list">
        {chords.map((chord, index) => (
          <div
            key={index}
            className={`chord-item ${currentIndex === index ? 'chord-item-current' : ''}`}
          >
            <div
              className="chord-item-content"
              onClick={() => !isPlaying && handleChordClick(chord)}
              style={{ cursor: isPlaying ? 'default' : 'pointer' }}
            >
              <span className="chord-item-index">{index + 1}</span>
              <span className="chord-item-name">{getChordDisplayName(chord)}</span>
            </div>
            <button
              className="chord-item-remove"
              onClick={() => onRemoveChord(index)}
              title="Remove chord"
              disabled={isPlaying}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordSequence;

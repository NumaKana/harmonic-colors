/**
 * SampleSelector - Modal for selecting sample chord progressions
 */

import { sampleSongs } from '../data/samples';
import './SampleSelector.css';

interface SampleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sampleId: string) => void;
}

const SampleSelector = ({ isOpen, onClose, onSelect }: SampleSelectorProps) => {
  if (!isOpen) return null;

  const handleSelect = (sampleId: string) => {
    onSelect(sampleId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="sample-selector-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="sample-selector-modal">
        <div className="sample-selector-header">
          <h2 className="sample-selector-title">サンプルを選択</h2>
          <button
            className="sample-selector-close"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="sample-selector-content">
          <p className="sample-selector-description">
            サンプルコード進行を選択してください。現在のコード進行は上書きされます。
          </p>

          <div className="sample-list">
            {sampleSongs.map((sample) => (
              <div
                key={sample.id}
                className="sample-item"
                onClick={() => handleSelect(sample.id)}
              >
                <div className="sample-item-main">
                  <h3 className="sample-item-title">{sample.title}</h3>
                  {sample.artist && (
                    <p className="sample-item-artist">{sample.artist}</p>
                  )}
                </div>
                {sample.description && (
                  <p className="sample-item-description">{sample.description}</p>
                )}
                <div className="sample-item-info">
                  <span className="sample-item-sections">
                    {sample.sections.length} sections
                  </span>
                  <span className="sample-item-chords">
                    {sample.sections.reduce((sum, s) => sum + s.chords.length, 0)} chords
                  </span>
                </div>
              </div>
            ))}
          </div>

          {sampleSongs.length === 0 && (
            <div className="sample-list-empty">
              <p>利用可能なサンプルがありません</p>
            </div>
          )}
        </div>

        <div className="sample-selector-footer">
          <button className="sample-selector-cancel" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </>
  );
};

export default SampleSelector;

import { Key, Note } from '../types';
import './KeySelector.css';

interface KeySelectorProps {
  selectedKey: Key;
  onKeyChange: (key: Key) => void;
}

const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const KeySelector = ({ selectedKey, onKeyChange }: KeySelectorProps) => {
  const handleTonicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey: Key = {
      tonic: e.target.value as Note,
      mode: selectedKey.mode,
    };
    onKeyChange(newKey);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey: Key = {
      tonic: selectedKey.tonic,
      mode: e.target.value as 'major' | 'minor',
    };
    onKeyChange(newKey);
  };

  return (
    <div className="key-selector">
      <div className="key-selector-group">
        <label htmlFor="tonic-select">Key:</label>
        <select
          id="tonic-select"
          value={selectedKey.tonic}
          onChange={handleTonicChange}
          className="key-select"
        >
          {NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </div>

      <div className="key-selector-group">
        <label htmlFor="mode-select">Mode:</label>
        <select
          id="mode-select"
          value={selectedKey.mode}
          onChange={handleModeChange}
          className="key-select"
        >
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
      </div>

      <div className="selected-key-display">
        {selectedKey.tonic} {selectedKey.mode === 'major' ? 'Major' : 'Minor'}
      </div>
    </div>
  );
};

export default KeySelector;

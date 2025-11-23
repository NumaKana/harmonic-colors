import { Section, Key } from '../types';
import KeySelector from './KeySelector';
import './SectionManager.css';

interface SectionManagerProps {
  sections: Section[];
  currentSectionId: string;
  onSectionSelect: (id: string) => void;
  onSectionAdd: () => void;
  onSectionRemove: (id: string) => void;
  onSectionNameChange: (id: string, name: string) => void;
  onSectionKeyChange: (id: string, key: Key) => void;
}

const SectionManager = ({
  sections,
  currentSectionId,
  onSectionSelect,
  onSectionAdd,
  onSectionRemove,
  onSectionNameChange,
  onSectionKeyChange
}: SectionManagerProps) => {
  const currentSection = sections.find(s => s.id === currentSectionId);

  return (
    <div className="section-manager">
      <div className="section-header">
        <h3>Sections</h3>
        <button className="add-section-button clickable" onClick={onSectionAdd} title="Add new section">
          + Add Section
        </button>
      </div>

      <div className="section-list">
        {sections.map(section => (
          <div
            key={section.id}
            className={`section-item ${section.id === currentSectionId ? 'active' : ''}`}
            onClick={() => onSectionSelect(section.id)}
          >
            <div className="section-item-header">
              <input
                type="text"
                value={section.name}
                onChange={(e) => {
                  e.stopPropagation();
                  onSectionNameChange(section.id, e.target.value);
                }}
                className="section-name-input"
                placeholder="Section name"
              />
              {sections.length > 1 && (
                <button
                  className="remove-section-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionRemove(section.id);
                  }}
                  title="Delete section"
                >
                  ×
                </button>
              )}
            </div>
            <div className="section-key-info">
              Key: {section.key.tonic} {section.key.mode === 'major' ? 'Major' : 'Minor'}
              {' '}({section.chords.length} chord{section.chords.length !== 1 ? 's' : ''})
            </div>
          </div>
        ))}
      </div>

      {currentSection && (
        <div className="current-section-controls">
          <h4>Current Section: {currentSection.name}</h4>
          <KeySelector
            selectedKey={currentSection.key}
            onKeyChange={(key) => onSectionKeyChange(currentSection.id, key)}
          />
        </div>
      )}
    </div>
  );
};

export default SectionManager;

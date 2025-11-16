import { useState, useEffect } from 'react';
import './HelpModal.css';
import JapaneseContent from './help/JapaneseContent';
import EnglishContent from './help/EnglishContent';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        {/* Language toggle */}
        <div className="language-toggle">
          <button
            className={language === 'ja' ? 'active' : ''}
            onClick={() => setLanguage('ja')}
          >
            日本語
          </button>
          <button
            className={language === 'en' ? 'active' : ''}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
        </div>

        {/* Content */}
        <div className="help-content">
          {language === 'ja' ? <JapaneseContent /> : <EnglishContent />}
        </div>

        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          {language === 'ja' ? '閉じる' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default HelpModal;

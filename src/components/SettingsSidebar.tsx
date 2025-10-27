import { Key } from '../types';
import HueWheel from './HueWheel';
import './SettingsSidebar.css';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  hueRotation: number;
  onHueRotationChange: (rotation: number) => void;
  selectedKey: Key;
}

const SettingsSidebar = ({
  isOpen,
  onClose,
  hueRotation,
  onHueRotationChange,
  selectedKey
}: SettingsSidebarProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="settings-overlay" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`settings-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button
            className="settings-close-button"
            onClick={onClose}
            title="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* Hue Rotation Control */}
          <div className="settings-section">
            <h3 className="settings-section-title">Color Adjustment</h3>

            {/* Hue Wheel Visual */}
            <HueWheel
              rotation={hueRotation}
              onChange={onHueRotationChange}
              currentKey={selectedKey.tonic}
            />

            <div className="hue-rotation-control">
              <label htmlFor="hue-rotation" className="hue-rotation-label">
                Hue Rotation:
              </label>
              <div className="hue-rotation-input-group">
                <input
                  type="number"
                  id="hue-rotation"
                  className="hue-rotation-input"
                  value={hueRotation}
                  onChange={(e) => onHueRotationChange(Number(e.target.value))}
                  min={0}
                  max={359}
                  title="Adjust the hue rotation angle (0-359°)"
                />
                <span className="hue-rotation-unit">°</span>
              </div>
              <button
                className="hue-rotation-reset"
                onClick={() => onHueRotationChange(0)}
                title="Reset to default (0°)"
              >
                Reset
              </button>
            </div>

            <p className="settings-description">
              Click on the color wheel or use the input to adjust the hue rotation.
              This affects all chord colors in the visualization.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSidebar;

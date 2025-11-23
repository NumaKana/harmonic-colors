import { Key, MinorScaleType, VisualizationStyle } from '../types';
import HueWheel from './HueWheel';
import './SettingsSidebar.css';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  majorHueRotation: number;
  minorHueRotation: number;
  onMajorHueRotationChange: (rotation: number) => void;
  onMinorHueRotationChange: (rotation: number) => void;
  selectedKey: Key;
  minorScaleType: MinorScaleType;
  onMinorScaleTypeChange: (scaleType: MinorScaleType) => void;
  visualizationStyle: VisualizationStyle;
  onVisualizationStyleChange: (style: VisualizationStyle) => void;
}

const SettingsSidebar = ({
  isOpen,
  onClose,
  majorHueRotation,
  minorHueRotation,
  onMajorHueRotationChange,
  onMinorHueRotationChange,
  selectedKey,
  minorScaleType,
  onMinorScaleTypeChange,
  visualizationStyle,
  onVisualizationStyleChange
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
            className="settings-close-button clickable"
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

            {/* Hue Wheel Visual with dual rings */}
            <HueWheel
              majorRotation={majorHueRotation}
              minorRotation={minorHueRotation}
              onMajorChange={onMajorHueRotationChange}
              onMinorChange={onMinorHueRotationChange}
              currentKey={selectedKey.tonic}
              currentMode={selectedKey.mode}
            />

            <div className="hue-rotation-controls">
              {/* Major Hue Rotation */}
              <div className="hue-rotation-control">
                <label htmlFor="major-hue-rotation" className="hue-rotation-label">
                  Major Hue Rotation:
                </label>
                <div className="hue-rotation-input-group">
                  <input
                    type="number"
                    id="major-hue-rotation"
                    className="hue-rotation-input"
                    value={majorHueRotation}
                    onChange={(e) => onMajorHueRotationChange(Number(e.target.value))}
                    min={0}
                    max={359}
                    title="Adjust the hue rotation for major keys (0-359°)"
                />
                <span className="hue-rotation-unit">°</span>
              </div>
              <button
                className="hue-rotation-reset"
                onClick={() => onMajorHueRotationChange(0)}
                title="Reset major hue to default (0°)"
              >
                Reset
              </button>
            </div>

            {/* Minor Hue Rotation */}
            <div className="hue-rotation-control">
              <label htmlFor="minor-hue-rotation" className="hue-rotation-label">
                Minor Hue Rotation:
              </label>
              <div className="hue-rotation-input-group">
                <input
                  type="number"
                  id="minor-hue-rotation"
                  className="hue-rotation-input"
                  value={minorHueRotation}
                  onChange={(e) => onMinorHueRotationChange(Number(e.target.value))}
                  min={0}
                  max={359}
                  title="Adjust the hue rotation for minor keys (0-359°)"
                />
                <span className="hue-rotation-unit">°</span>
              </div>
              <button
                className="hue-rotation-reset"
                onClick={() => onMinorHueRotationChange(90)}
                title="Reset minor hue to default (90°)"
              >
                Reset
              </button>
            </div>

            {/* Reset Both Button */}
            <button
              className="hue-rotation-reset-both clickable"
              onClick={() => {
                onMajorHueRotationChange(0);
                onMinorHueRotationChange(90);
              }}
              title="Reset both major and minor hue rotations to default (major: 0°, minor: 90°)"
            >
              Reset Both
            </button>
          </div>

          <p className="settings-description">
            Click on the outer ring (major) or inner ring (minor) of the color wheel to adjust hue rotations separately.
            This allows different color schemes for major and minor keys.
          </p>
        </div>

          {/* Visualization Style Control */}
          <div className="settings-section">
            <h3 className="settings-section-title">Visualization Style</h3>
            <div className="visualization-style-options">
              <label className="visualization-style-option">
                <input
                  type="radio"
                  name="visualization-style"
                  value="marble"
                  checked={visualizationStyle === 'marble'}
                  onChange={() => onVisualizationStyleChange('marble')}
                />
                <span className="visualization-style-label">Marble Pattern</span>
                <span className="visualization-style-detail">Smooth blended gradient</span>
              </label>
              <label className="visualization-style-option">
                <input
                  type="radio"
                  name="visualization-style"
                  value="stripes"
                  checked={visualizationStyle === 'stripes'}
                  onChange={() => onVisualizationStyleChange('stripes')}
                />
                <span className="visualization-style-label">Horizontal Stripes</span>
                <span className="visualization-style-detail">20% Color1 / 60% Color2 / 20% Color1</span>
              </label>
            </div>
            <p className="settings-description">
              Choose between a smooth marble pattern or clean horizontal stripes.
              Particles are displayed in both styles.
            </p>
          </div>

          {/* Minor Scale Type Control */}
          <div className="settings-section">
            <h3 className="settings-section-title">Minor Scale Type</h3>
            <div className="minor-scale-options">
              <label className="minor-scale-option">
                <input
                  type="radio"
                  name="minor-scale-type"
                  value="natural"
                  checked={minorScaleType === 'natural'}
                  onChange={() => onMinorScaleTypeChange('natural')}
                />
                <span className="minor-scale-label">Natural Minor</span>
                <span className="minor-scale-detail">i, ii°, III, iv, v, VI, VII</span>
              </label>
              <label className="minor-scale-option">
                <input
                  type="radio"
                  name="minor-scale-type"
                  value="harmonic"
                  checked={minorScaleType === 'harmonic'}
                  onChange={() => onMinorScaleTypeChange('harmonic')}
                />
                <span className="minor-scale-label">Harmonic Minor</span>
                <span className="minor-scale-detail">i, ii°, III+, iv, V, VI, vii°</span>
              </label>
              <label className="minor-scale-option">
                <input
                  type="radio"
                  name="minor-scale-type"
                  value="melodic"
                  checked={minorScaleType === 'melodic'}
                  onChange={() => onMinorScaleTypeChange('melodic')}
                />
                <span className="minor-scale-label">Melodic Minor</span>
                <span className="minor-scale-detail">i, ii, III+, IV, V, vi°, vii°</span>
              </label>
            </div>
            <p className="settings-description">
              Select the minor scale type for generating diatonic chords in minor keys.
              This only affects minor keys; major keys remain unchanged.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSidebar;

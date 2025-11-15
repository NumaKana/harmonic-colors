import { Key, MinorScaleType, VisualizationStyle } from '../types';
import HueWheel from './HueWheel';
import './SettingsSidebar.css';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  hueRotation: number;
  onHueRotationChange: (rotation: number) => void;
  selectedKey: Key;
  minorScaleType: MinorScaleType;
  onMinorScaleTypeChange: (scaleType: MinorScaleType) => void;
  visualizationStyle: VisualizationStyle;
  onVisualizationStyleChange: (style: VisualizationStyle) => void;
}

const SettingsSidebar = ({
  isOpen,
  onClose,
  hueRotation,
  onHueRotationChange,
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
                <span className="visualization-style-detail">30% Color1 / 40% Color2 / 30% Color1</span>
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

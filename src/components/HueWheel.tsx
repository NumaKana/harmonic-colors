import { Note } from '../types';
import './HueWheel.css';

interface HueWheelProps {
  majorRotation: number;
  minorRotation: number;
  onMajorChange: (rotation: number) => void;
  onMinorChange: (rotation: number) => void;
  currentKey?: Note;
  currentMode?: 'major' | 'minor';
}

const HueWheel = ({
  majorRotation,
  minorRotation,
  onMajorChange,
  onMinorChange,
  currentKey,
  currentMode = 'major'
}: HueWheelProps) => {
  const size = 260;
  const center = size / 2;
  const outerRadius = 90; // Outer ring for major
  const innerRadius = 65; // Inner ring for minor
  const centerRadius = 40; // Center area
  const markerRadius = 10;

  // 12音のマッピング（C = 0°基準）
  const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteToHue = (note: Note): number => {
    const index = NOTES.indexOf(note);
    return index * 30; // 360 / 12 = 30度ずつ
  };

  // Handle click on outer ring (major)
  const handleOuterRingClick = (e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg || !currentKey) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;

    // Calculate angle from center (0° = top)
    let clickedAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (clickedAngle < 0) clickedAngle += 360;

    // Calculate rotation needed so that clicked position becomes the current key
    const currentKeyHue = noteToHue(currentKey);
    const newRotation = (clickedAngle - currentKeyHue + 360) % 360;

    onMajorChange(Math.round(newRotation));
  };

  // Handle click on inner ring (minor)
  const handleInnerRingClick = (e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg || !currentKey) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;

    // Calculate angle from center (0° = top)
    let clickedAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (clickedAngle < 0) clickedAngle += 360;

    // Calculate rotation needed so that clicked position becomes the current key
    const currentKeyHue = noteToHue(currentKey);
    const newRotation = (clickedAngle - currentKeyHue + 360) % 360;

    onMinorChange(Math.round(newRotation));
  };

  // Generate single unified hue wheel segments (uses major rotation for display)
  const generateUnifiedHueWheel = () => {
    return Array.from({ length: 360 }, (_, i) => {
      const startAngle = (i - 90) * (Math.PI / 180);
      const endAngle = (i + 1 - 90) * (Math.PI / 180);
      const innerRad = innerRadius + 5;

      const x1 = center + innerRad * Math.cos(startAngle);
      const y1 = center + innerRad * Math.sin(startAngle);
      const x2 = center + outerRadius * Math.cos(startAngle);
      const y2 = center + outerRadius * Math.sin(startAngle);
      const x3 = center + outerRadius * Math.cos(endAngle);
      const y3 = center + outerRadius * Math.sin(endAngle);
      const x4 = center + innerRad * Math.cos(endAngle);
      const y4 = center + innerRad * Math.sin(endAngle);

      const path = `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;

      return (
        <path
          key={i}
          d={path}
          fill={`hsl(${i}, 100%, 50%)`}
          stroke="none"
        />
      );
    });
  };

  return (
    <div className="hue-wheel-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="hue-wheel-svg"
      >
        {/* Unified hue wheel */}
        {generateUnifiedHueWheel()}

        {/* Outer ring clickable area (major) */}
        <g className="outer-ring-clickable" onClick={handleOuterRingClick} style={{ cursor: 'pointer' }}>
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="transparent"
            strokeWidth="20"
            style={{ pointerEvents: 'stroke' }}
          />
        </g>

        {/* Inner ring clickable area (minor) */}
        <g className="inner-ring-clickable" onClick={handleInnerRingClick} style={{ cursor: 'pointer' }}>
          <circle
            cx={center}
            cy={center}
            r={(innerRadius + 5 + centerRadius) / 2}
            fill="none"
            stroke="transparent"
            strokeWidth={innerRadius + 5 - centerRadius}
            style={{ pointerEvents: 'stroke' }}
          />
        </g>

        {/* Outer ring border */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="#555"
          strokeWidth="2"
          style={{ pointerEvents: 'none' }}
        />

        {/* Inner separator */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius + 5}
          fill="none"
          stroke="#555"
          strokeWidth="2"
          style={{ pointerEvents: 'none' }}
        />

        {/* 12音すべてのマーカーを外周に表示 */}
        {NOTES.map((note) => {
          const noteHue = noteToHue(note);

          // Major rotation marker
          const majorActualHue = (noteHue + majorRotation) % 360;
          const majorAngle = (noteHue + majorRotation - 90) * (Math.PI / 180);
          const majorMarkerX = center + outerRadius * Math.cos(majorAngle);
          const majorMarkerY = center + outerRadius * Math.sin(majorAngle);
          const isMajorCurrentKey = note === currentKey && currentMode === 'major';

          // Minor rotation marker
          const minorActualHue = (noteHue + minorRotation) % 360;
          const minorAngle = (noteHue + minorRotation - 90) * (Math.PI / 180);
          const minorMarkerRadius = (innerRadius + 5 + centerRadius) / 2;
          const minorMarkerX = center + minorMarkerRadius * Math.cos(minorAngle);
          const minorMarkerY = center + minorMarkerRadius * Math.sin(minorAngle);
          const isMinorCurrentKey = note === currentKey && currentMode === 'minor';

          return (
            <g key={note} style={{ pointerEvents: 'none' }}>
              {/* Major marker (outer) */}
              <g className="hue-wheel-note-marker">
                {/* 音名ラベル（外側） */}
                <text
                  x={majorMarkerX + (majorMarkerX - center) * 0.35}
                  y={majorMarkerY + (majorMarkerY - center) * 0.35}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`hue-wheel-note-label ${isMajorCurrentKey ? 'current' : ''}`}
                  fill={isMajorCurrentKey ? '#fff' : '#999'}
                  fontSize={isMajorCurrentKey ? '13' : '11'}
                  fontWeight={isMajorCurrentKey ? '700' : '500'}
                >
                  {note}
                </text>

                {/* マーカードット */}
                <circle
                  cx={majorMarkerX}
                  cy={majorMarkerY}
                  r={isMajorCurrentKey ? markerRadius : 6}
                  fill="white"
                  stroke="#333"
                  strokeWidth={isMajorCurrentKey ? 3 : 2}
                />
                <circle
                  cx={majorMarkerX}
                  cy={majorMarkerY}
                  r={isMajorCurrentKey ? markerRadius - 3 : 4}
                  fill={`hsl(${majorActualHue}, 100%, 50%)`}
                />
              </g>

              {/* Minor marker (inner) */}
              <g className="hue-wheel-note-marker-minor">
                {/* マーカードット (smaller for minor) */}
                <circle
                  cx={minorMarkerX}
                  cy={minorMarkerY}
                  r={isMinorCurrentKey ? 6 : 4}
                  fill="white"
                  stroke="#333"
                  strokeWidth={isMinorCurrentKey ? 2 : 1.5}
                />
                <circle
                  cx={minorMarkerX}
                  cy={minorMarkerY}
                  r={isMinorCurrentKey ? 4 : 2.5}
                  fill={`hsl(${minorActualHue}, 100%, 42%)`}
                />

                {/* 音名ラベル（マーカーの内側） */}
                <text
                  x={minorMarkerX - (minorMarkerX - center) * 0.35}
                  y={minorMarkerY - (minorMarkerY - center) * 0.35}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`hue-wheel-note-label ${isMinorCurrentKey ? 'current' : ''}`}
                  fill={isMinorCurrentKey ? '#fff' : '#888'}
                  fontSize={isMinorCurrentKey ? '11' : '9'}
                  fontWeight={isMinorCurrentKey ? '700' : '500'}
                >
                  {note}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="hue-wheel-labels">
        <div className="hue-label">
          <span style={{ color: '#aaa', fontSize: '12px' }}>Outer: Major (click outer ring)</span>
        </div>
        <div className="hue-label">
          <span style={{ color: '#aaa', fontSize: '12px' }}>Inner: Minor (click inner ring)</span>
        </div>
      </div>
    </div>
  );
};

export default HueWheel;

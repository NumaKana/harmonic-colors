import { Note } from '../types';
import './HueWheel.css';

interface HueWheelProps {
  rotation: number;
  onChange: (rotation: number) => void;
  currentKey?: Note;
}

const HueWheel = ({ rotation, onChange, currentKey }: HueWheelProps) => {
  const size = 260;
  const center = size / 2;
  const radius = 90;
  const markerRadius = 10;

  // 12音のマッピング（C = 0°基準）
  const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteToHue = (note: Note): number => {
    const index = NOTES.indexOf(note);
    return index * 30; // 360 / 12 = 30度ずつ
  };

  // Handle click on wheel to set rotation
  const handleWheelClick = (e: React.MouseEvent<SVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;

    // Calculate angle from center
    let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (newAngle < 0) newAngle += 360;

    onChange(Math.round(newAngle % 360));
  };

  return (
    <div className="hue-wheel-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="hue-wheel-svg"
        onClick={handleWheelClick}
      >
        <defs>
          {/* Radial gradient for depth effect */}
          <radialGradient id="hue-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </radialGradient>

          {/* Conic gradient approximation using multiple segments */}
          <linearGradient id="hue-gradient-0" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(0, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(30, 100%, 50%)" />
          </linearGradient>
        </defs>

        {/* Draw hue wheel as multiple colored segments */}
        {Array.from({ length: 360 }, (_, i) => {
          const startAngle = (i - 90) * (Math.PI / 180);
          const endAngle = (i + 1 - 90) * (Math.PI / 180);
          const innerRadius = radius - 20;

          const x1 = center + innerRadius * Math.cos(startAngle);
          const y1 = center + innerRadius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(startAngle);
          const y2 = center + radius * Math.sin(startAngle);
          const x3 = center + radius * Math.cos(endAngle);
          const y3 = center + radius * Math.sin(endAngle);
          const x4 = center + innerRadius * Math.cos(endAngle);
          const y4 = center + innerRadius * Math.sin(endAngle);

          const path = `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;

          return (
            <path
              key={i}
              d={path}
              fill={`hsl(${i}, 100%, 50%)`}
              stroke="none"
            />
          );
        })}

        {/* Center circle (white background) */}
        <circle
          cx={center}
          cy={center}
          r={radius - 20}
          fill="#2a2a2a"
          stroke="#555"
          strokeWidth="2"
        />

        {/* Rotation value text in center */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="hue-wheel-text"
          fill="#fff"
          fontSize="24"
          fontWeight="600"
        >
          {rotation}°
        </text>

        {/* Current key label in center */}
        {currentKey && (
          <text
            x={center}
            y={center + 15}
            textAnchor="middle"
            dominantBaseline="central"
            className="hue-wheel-key-text"
            fill="#aaa"
            fontSize="14"
            fontWeight="500"
          >
            Key: {currentKey}
          </text>
        )}

        {/* 12音すべてのマーカーを表示 */}
        {NOTES.map((note) => {
          const noteHue = noteToHue(note);
          const actualHue = (noteHue + rotation) % 360;
          // マーカーの位置も回転を反映
          const noteAngle = (noteHue + rotation - 90) * (Math.PI / 180);
          const noteX = center + radius * Math.cos(noteAngle);
          const noteY = center + radius * Math.sin(noteAngle);
          const isCurrentKey = note === currentKey;

          return (
            <g key={note} className="hue-wheel-note-marker">
              {/* 音名ラベル（外側） */}
              <text
                x={noteX + (noteX - center) * 0.35}
                y={noteY + (noteY - center) * 0.35}
                textAnchor="middle"
                dominantBaseline="central"
                className={`hue-wheel-note-label ${isCurrentKey ? 'current' : ''}`}
                fill={isCurrentKey ? '#fff' : '#999'}
                fontSize={isCurrentKey ? '13' : '11'}
                fontWeight={isCurrentKey ? '700' : '500'}
              >
                {note}
              </text>

              {/* マーカードット */}
              <circle
                cx={noteX}
                cy={noteY}
                r={isCurrentKey ? markerRadius : 6}
                fill="white"
                stroke="#333"
                strokeWidth={isCurrentKey ? 3 : 2}
              />
              <circle
                cx={noteX}
                cy={noteY}
                r={isCurrentKey ? markerRadius - 3 : 4}
                fill={`hsl(${actualHue}, 100%, 50%)`}
              />
            </g>
          );
        })}

        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#555"
          strokeWidth="2"
        />
      </svg>

      <div className="hue-wheel-labels">
        <div className="hue-label" style={{ color: 'hsl(0, 100%, 60%)' }}>Red (0°)</div>
        <div className="hue-label" style={{ color: 'hsl(120, 100%, 60%)' }}>Green (120°)</div>
        <div className="hue-label" style={{ color: 'hsl(240, 100%, 60%)' }}>Blue (240°)</div>
      </div>
    </div>
  );
};

export default HueWheel;

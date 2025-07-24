import React, { useState } from 'react';
import NumberInputModal from './NumberInputModal';

const RADIUS = 48;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MIN_FLOW = 100;
const MAX_FLOW = 5000;
const STEP = 100;

function getOffset(flow) {
  const percent = (flow - MIN_FLOW) / (MAX_FLOW - MIN_FLOW);
  return CIRCUMFERENCE * (1 - percent);
}

const AirFlowSlider = ({ value, setValue, label = 'Расход воздуха, м³/ч' }) => {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => { setInputValue(value); }, [value]);

  const handleMinus = () => {
    if (value > MIN_FLOW) setValue(value - STEP);
  };
  const handlePlus = () => {
    if (value < MAX_FLOW) setValue(value + STEP);
  };
  const handleSlider = e => {
    const val = Number(e.target.value);
    setValue(val);
  };
  const handleInputChange = e => {
    setInputValue(e.target.value);
  };
  const handleInputBlur = () => {
    let val = Number(inputValue);
    if (isNaN(val)) val = value;
    val = Math.max(MIN_FLOW, Math.min(MAX_FLOW, val));
    setValue(val);
    setEditMode(false);
  };
  const handleInputKeyDown = e => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '18px 0' }}>
      <div style={{ color: '#bfc9d1', fontSize: '1.1em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button
          onClick={handleMinus}
          style={{
            width: 38, height: 38, borderRadius: '50%', background: '#363c43', color: '#bfc9d1', border: 'none', fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s', fontWeight: 600
          }}
          aria-label="Уменьшить расход"
        >
          −
        </button>
        <div style={{ position: 'relative', width: 2 * (RADIUS + STROKE), height: 2 * (RADIUS + STROKE) }}>
          <svg width={2 * (RADIUS + STROKE)} height={2 * (RADIUS + STROKE)}>
            <circle
              cx={RADIUS + STROKE}
              cy={RADIUS + STROKE}
              r={RADIUS}
              stroke="#444851"
              strokeWidth={STROKE}
              fill="#111216"
            />
            <circle
              cx={RADIUS + STROKE}
              cy={RADIUS + STROKE}
              r={RADIUS}
              stroke="#4cc9f0"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={getOffset(value)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1, cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => setModalOpen(true)}>
              {value}
            </span>
            <span style={{ color: '#bfc9d1', fontSize: 15, marginTop: -2 }}>м³/ч</span>
          </div>
          <input
            type="range"
            min={MIN_FLOW}
            max={MAX_FLOW}
            step={STEP}
            value={value}
            onChange={handleSlider}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer',
            }}
            aria-label="Слайдер расхода воздуха"
          />
          <NumberInputModal
            open={modalOpen}
            value={value}
            min={MIN_FLOW}
            max={MAX_FLOW}
            step={STEP}
            label={label}
            unit="м³/ч"
            onClose={() => setModalOpen(false)}
            onSubmit={val => { setValue(val); setModalOpen(false); }}
          />
        </div>
        <button
          onClick={handlePlus}
          style={{
            width: 38, height: 38, borderRadius: '50%', background: '#363c43', color: '#bfc9d1', border: 'none', fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s', fontWeight: 600
          }}
          aria-label="Увеличить расход"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default AirFlowSlider; 
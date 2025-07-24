import React, { useState } from 'react';
import NumberInputModal from './NumberInputModal';

const RADIUS = 48;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MIN_TEMP = 10;
const MAX_TEMP = 30;

function getOffset(temp) {
  const percent = (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  return CIRCUMFERENCE * (1 - percent);
}

const TemperatureSlider = ({ value, setValue, label = 'Температура воздуха, °C' }) => {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => { setInputValue(value); }, [value]);

  const handleMinus = () => {
    if (value > MIN_TEMP) setValue(value - 1);
  };
  const handlePlus = () => {
    if (value < MAX_TEMP) setValue(value + 1);
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
    val = Math.max(MIN_TEMP, Math.min(MAX_TEMP, val));
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
          aria-label="Уменьшить температуру"
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
            <span style={{ color: '#fff', fontSize: 36, fontWeight: 700, lineHeight: 1, cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => setModalOpen(true)}>
              {value}
            </span>
            <span style={{ color: '#bfc9d1', fontSize: 16, marginTop: -2 }}>°C</span>
          </div>
          <input
            type="range"
            min={MIN_TEMP}
            max={MAX_TEMP}
            value={value}
            onChange={handleSlider}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer',
            }}
            aria-label="Слайдер температуры"
          />
          <NumberInputModal
            open={modalOpen}
            value={value}
            min={MIN_TEMP}
            max={MAX_TEMP}
            step={1}
            label={label}
            unit="°C"
            onClose={() => setModalOpen(false)}
            onSubmit={val => { setValue(val); setModalOpen(false); }}
          />
        </div>
        <button
          onClick={handlePlus}
          style={{
            width: 38, height: 38, borderRadius: '50%', background: '#363c43', color: '#bfc9d1', border: 'none', fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s', fontWeight: 600
          }}
          aria-label="Увеличить температуру"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TemperatureSlider; 
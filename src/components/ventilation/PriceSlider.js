import React, { useState } from 'react';
import NumberInputModal from './NumberInputModal';

const RADIUS = 48;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getOffset(value, min, max) {
  const percent = (value - min) / (max - min);
  return CIRCUMFERENCE * (1 - percent);
}

const PriceSlider = ({ value, setValue, label = 'Стоимость', min = 0, max = 10000, step = 10, unit = '₽' }) => {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => { setInputValue(value); }, [value]);

  const handleMinus = () => {
    if (value > min) setValue(value - step);
  };
  const handlePlus = () => {
    if (value < max) setValue(value + step);
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
    val = Math.max(min, Math.min(max, val));
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
          aria-label="Уменьшить стоимость"
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
              strokeDashoffset={getOffset(value, min, max)}
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
              {Number.isInteger(value) ? value : value.toFixed(1)}
            </span>
            <span style={{ color: '#bfc9d1', fontSize: 15, marginTop: -2 }}>{unit}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSlider}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer',
            }}
            aria-label="Слайдер стоимости"
          />
          <NumberInputModal
            open={modalOpen}
            value={value}
            min={min}
            max={max}
            step={step}
            label={label}
            unit={unit}
            onClose={() => setModalOpen(false)}
            onSubmit={val => { setValue(val); setModalOpen(false); }}
          />
        </div>
        <button
          onClick={handlePlus}
          style={{
            width: 38, height: 38, borderRadius: '50%', background: '#363c43', color: '#bfc9d1', border: 'none', fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s', fontWeight: 600
          }}
          aria-label="Увеличить стоимость"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default PriceSlider; 
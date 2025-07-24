import React, { useState, useEffect } from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.45)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle = {
  background: '#181d27',
  borderRadius: 16,
  padding: '28px 22px 18px 22px',
  minWidth: 260,
  maxWidth: '90vw',
  boxShadow: '0 8px 38px rgba(76,201,240,0.13)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const inputStyle = {
  fontSize: 28,
  fontWeight: 700,
  textAlign: 'center',
  border: '2px solid #4cc9f0',
  borderRadius: 8,
  outline: 'none',
  width: 120,
  marginBottom: 18,
  background: '#232b3b',
  color: '#fff',
  padding: '8px 0',
};

const buttonRow = {
  display: 'flex',
  gap: 16,
  marginTop: 8,
};

const buttonStyle = {
  fontSize: 18,
  fontWeight: 600,
  borderRadius: 8,
  border: 'none',
  padding: '8px 22px',
  cursor: 'pointer',
  background: '#4cc9f0',
  color: '#181d27',
  transition: 'background 0.18s',
};

const cancelStyle = {
  ...buttonStyle,
  background: '#bfc9d1',
  color: '#181d27',
};

const NumberInputModal = ({ open, value, min, max, step, onChange, onClose, onSubmit, label, unit }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (open) setInputValue(value);
  }, [open, value]);

  if (!open) return null;

  const handleInput = e => {
    setInputValue(e.target.value);
  };
  const handleOk = () => {
    let val = Number(inputValue);
    if (isNaN(val)) val = value;
    if (typeof min === 'number') val = Math.max(min, val);
    if (typeof max === 'number') val = Math.min(max, val);
    onSubmit(val);
  };
  const handleCancel = () => {
    onClose();
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter') handleOk();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div style={modalStyle} onClick={handleCancel}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {label && <div style={{color:'#bfc9d1',fontSize:18,marginBottom:10}}>{label}</div>}
        <input
          type="number"
          value={inputValue}
          min={min}
          max={max}
          step={step}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          autoFocus
        />
        {unit && <span style={{color:'#bfc9d1',fontSize:16,marginBottom:10}}>{unit}</span>}
        <div style={buttonRow}>
          <button style={buttonStyle} onClick={handleOk}>OK</button>
          <button style={cancelStyle} onClick={handleCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default NumberInputModal; 
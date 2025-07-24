import React, { useState } from 'react';
import './FlowCalculator.css';

const RADIATOR_TYPES = [
  { id: 'bimetal', name: 'Биметаллический', powerPerSection: 170 },
  { id: 'aluminum', name: 'Алюминиевый', powerPerSection: 190 },
  { id: 'cast_iron', name: 'Чугунный', powerPerSection: 150 },
];

function RadiatorSelectionCalculator({ onBack }) {
  const [roomArea, setRoomArea] = useState(20);
  const [ceilingHeight, setCeilingHeight] = useState(2.7);
  const [windowCount, setWindowCount] = useState(1);
  const [wallType, setWallType] = useState('brick');
  const [radiatorType, setRadiatorType] = useState('bimetal');
  const [tooltip, setTooltip] = useState(false);

  // Расчет тепловой мощности
  const calculateHeatLoad = () => {
    const baseLoad = roomArea * 100; // Базовое значение 100 Вт/м²
    const heightFactor = ceilingHeight > 2.7 ? 1.1 : 1;
    const windowFactor = 1 + (windowCount * 0.1);
    const wallFactor = wallType === 'brick' ? 1 : 1.2;

    return baseLoad * heightFactor * windowFactor * wallFactor;
  };

  // Расчет количества секций
  const calculateSections = () => {
    const heatLoad = calculateHeatLoad();
    const selectedRadiator = RADIATOR_TYPES.find(r => r.id === radiatorType);
    const sections = Math.ceil(heatLoad / selectedRadiator.powerPerSection);
    return sections;
  };

  const formulaContent = (
    <>
      <strong>Формула расчета тепловой нагрузки:</strong>
      <span className="formula">Q = S × 100 × k1 × k2 × k3</span>
      <b>Q</b> — тепловая нагрузка (Вт)<br />
      <b>S</b> — площадь помещения (м²)<br />
      <b>k1</b> — коэффициент высоты потолка<br />
      <b>k2</b> — коэффициент окон<br />
      <b>k3</b> — коэффициент стен<br />
    </>
  );

  return (
    <div className="container">
      <div className="card" style={{position:'relative'}}>
        {onBack && (
          <button
            className="back-btn"
            onClick={onBack}
            aria-label="Назад"
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'var(--main-blue)',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(76,201,240,0.13)',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'background 0.2s, transform 0.2s',
              padding: 0,
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4L8 11L15 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button
          className="info-btn info-btn-square"
          tabIndex={0}
          aria-label="Пояснение"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'var(--main-blue)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(76,201,240,0.13)',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'background 0.2s, transform 0.2s',
            padding: 0,
          }}
          onClick={() => setTooltip(!tooltip)}
          onBlur={() => setTooltip(false)}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="10" y="7" width="2" height="2" rx="1" fill="white"/>
            <rect x="10" y="11" width="2" height="6" rx="1" fill="white"/>
          </svg>
        </button>
        <div className="header-row">
          <div className="card-title">Подбор радиаторов отопления</div>
        </div>
        <div className={`tooltip${tooltip ? ' active' : ''}`}>
          {formulaContent}
        </div>

        {/* Результаты расчета */}
        <div className="results-block">
          <div className="result-row">
            <span className="result-label">Требуемая тепловая мощность:</span>
            <span className="result-value">{Math.round(calculateHeatLoad())} Вт</span>
          </div>
          <div className="result-row">
            <span className="result-label">Количество секций:</span>
            <span className="result-value">{calculateSections()} шт.</span>
          </div>
        </div>

        {/* Параметры помещения */}
        <div className="form-group">
          <label>Площадь помещения (м²)</label>
          <input
            type="number"
            value={roomArea}
            min={5}
            max={100}
            step={1}
            onChange={e => setRoomArea(Number(e.target.value))}
          />
          <div className="slider-block">
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={roomArea}
              onChange={e => setRoomArea(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Высота потолка (м)</label>
          <input
            type="number"
            value={ceilingHeight}
            min={2.2}
            max={4}
            step={0.1}
            onChange={e => setCeilingHeight(Number(e.target.value))}
          />
          <div className="slider-block">
            <input
              type="range"
              min={2.2}
              max={4}
              step={0.1}
              value={ceilingHeight}
              onChange={e => setCeilingHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Количество окон</label>
          <input
            type="number"
            value={windowCount}
            min={0}
            max={5}
            step={1}
            onChange={e => setWindowCount(Number(e.target.value))}
          />
          <div className="slider-block">
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={windowCount}
              onChange={e => setWindowCount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Тип стен</label>
          <select value={wallType} onChange={e => setWallType(e.target.value)}>
            <option value="brick">Кирпичные</option>
            <option value="panel">Панельные</option>
            <option value="wood">Деревянные</option>
          </select>
        </div>

        <div className="form-group">
          <label>Тип радиатора</label>
          <select value={radiatorType} onChange={e => setRadiatorType(e.target.value)}>
            {RADIATOR_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="footer-signature">Galf Design</div>
      </div>
    </div>
  );
}

export default RadiatorSelectionCalculator; 
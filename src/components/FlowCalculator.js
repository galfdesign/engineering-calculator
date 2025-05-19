import React, { useState } from 'react';
import './FlowCalculator.css';

const FLUIDS = [
  { value: 'water', label: 'Вода', coef: 1.163 },
  { value: 'pglycol30', label: 'Пропиленгликоль 30%', coef: 1.07 },
  { value: 'pglycol40', label: 'Пропиленгликоль 40%', coef: 1.03 },
  { value: 'pglycol50', label: 'Пропиленгликоль 50%', coef: 0.99 },
  { value: 'eglycol30', label: 'Этиленгликоль 30%', coef: 1.08 },
  { value: 'eglycol40', label: 'Этиленгликоль 40%', coef: 1.04 },
  { value: 'eglycol50', label: 'Этиленгликоль 50%', coef: 1.00 },
  { value: 'glycerin40', label: 'Глицерин 40%', coef: 1.10 },
  { value: 'glycerin50', label: 'Глицерин 50%', coef: 1.06 },
];

const FLOW_UNITS = {
  m3h: {
    name: 'м³/час',
    toM3h: (val) => val,
    fromM3h: (val) => val,
    min: 0.1,
    max: 10,
    step: 0.01,
    default: 1,
  },
  lmin: {
    name: 'л/мин',
    toM3h: (val) => val * 0.06,
    fromM3h: (val) => val / 0.06,
    min: 1,
    max: 200,
    step: 0.1,
    default: 60,
  },
  lsec: {
    name: 'л/сек',
    toM3h: (val) => val * 3.6,
    fromM3h: (val) => val / 3.6,
    min: 0.2,
    max: 20,
    step: 0.01,
    default: 1,
  },
};

function formatNumber(num) {
  return Number(num).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const FlowCalculator = ({ onBack }) => {
  const [mode, setMode] = useState('flow');
  const [fluid, setFluid] = useState('water');
  const [power, setPower] = useState(15);
  const [flow, setFlow] = useState(1);
  const [flowUnit, setFlowUnit] = useState('m3h');
  const [deltaT, setDeltaT] = useState(20);
  const [tooltip, setTooltip] = useState(false);

  const coef = FLUIDS.find(f => f.value === fluid).coef;
  const unitObj = FLOW_UNITS[flowUnit];

  // Формулы
  const getFormula = () => mode === 'flow' ? 'G = Q / (C × Δt)' : 'Q = G × C × Δt';

  // Расчёты
  let result = {};
  if (mode === 'flow') {
    const m3h = power / (deltaT * coef);
    result = {
      m3h: isFinite(m3h) ? formatNumber(m3h) : '-',
      lmin: isFinite(m3h) ? formatNumber(m3h * 1000 / 60) : '-',
      lsec: isFinite(m3h) ? formatNumber(m3h * 1000 / 3600) : '-',
    };
  } else {
    const m3h = unitObj.toM3h(flow);
    const q = m3h * coef * deltaT;
    result = {
      power: isFinite(q) ? formatNumber(q) : '-',
    };
  }

  // Смена единиц расхода
  const handleFlowUnitChange = (e) => {
    const newUnit = e.target.value;
    const m3hVal = FLOW_UNITS[flowUnit].toM3h(flow);
    const newVal = FLOW_UNITS[newUnit].fromM3h(m3hVal);
    setFlowUnit(newUnit);
    setFlow(Number(newVal.toFixed(3)));
  };

  return (
    <div className="container">
      <div className="card" style={{position: 'relative'}}>
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
        <div className="header-row">
          <div className="card-title">Тепловой расчёт</div>
          <button
            className="info-btn"
            tabIndex={0}
            aria-label="Пояснение"
            onClick={() => setTooltip(!tooltip)}
            onBlur={() => setTooltip(false)}
          >
            <span>ℹ️</span>
          </button>
          <div className={`tooltip${tooltip ? ' active' : ''}`}>
            <strong>Формулы расчёта:</strong>
            <span className="formula">{getFormula()}</span>
            <b>G</b> — расход жидкости, м³/ч<br />
            <b>Q</b> — тепловая мощность, кВт<br />
            <b>Δt</b> — температурный перепад, °C<br />
            <b>C</b> — коэффициент теплоёмкости, зависит от типа жидкости (см. список)<br />
            <br />
            <b>Примечания:</b>
            <ul style={{margin:0, paddingLeft:20}}>
              <li>Для воды C = 1.163 кВт·ч/(м³·°C)</li>
              <li>Для гликолей и глицерина C рассчитывается индивидуально</li>
              <li>В формуле учитывается средняя теплоёмкость для типовых концентраций антифриза</li>
            </ul>
          </div>
        </div>
        <div className="toggle-row">
          <div className="toggle-btn">
            <button
              className={`toggle-option${mode === 'flow' ? ' active' : ''}`}
              onClick={() => setMode('flow')}
            >
              Расход по мощности
            </button>
            <button
              className={`toggle-option${mode === 'power' ? ' active' : ''}`}
              onClick={() => setMode('power')}
            >
              Мощность по расходу
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="fluidType">Тип жидкости</label>
          <select
            id="fluidType"
            value={fluid}
            onChange={e => setFluid(e.target.value)}
          >
            {FLUIDS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        {mode === 'flow' ? (
          <div className="form-group">
            <label htmlFor="power">Тепловая мощность Q, кВт</label>
            <input
              type="number"
              id="powerNum"
              step="any"
              min={1}
              max={100}
              value={power}
              onChange={e => setPower(Number(e.target.value))}
            />
            <div className="slider-block">
              <input
                type="range"
                id="power"
                min={1}
                max={100}
                step={0.5}
                value={power}
                onChange={e => setPower(Number(e.target.value))}
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <div className="units-row">
              <label htmlFor="flow" style={{marginBottom:0}}>Расход жидкости G</label>
              <select
                id="flowUnit"
                value={flowUnit}
                onChange={handleFlowUnitChange}
                style={{width:'auto',maxWidth:120}}
              >
                {Object.entries(FLOW_UNITS).map(([key, u]) => (
                  <option key={key} value={key}>{u.name}</option>
                ))}
              </select>
            </div>
            <input
              type="number"
              id="flowNum"
              step="any"
              min={unitObj.min}
              max={unitObj.max}
              value={flow}
              onChange={e => setFlow(Number(e.target.value))}
            />
            <div className="slider-block">
              <input
                type="range"
                id="flow"
                min={unitObj.min}
                max={unitObj.max}
                step={unitObj.step}
                value={flow}
                onChange={e => setFlow(Number(e.target.value))}
              />
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="deltaTemp">Температурный перепад ∆t, °C</label>
          <input
            type="number"
            id="deltaTempNum"
            step="any"
            min={3}
            max={60}
            value={deltaT}
            onChange={e => setDeltaT(Number(e.target.value))}
          />
          <div className="slider-block">
            <input
              type="range"
              id="deltaTemp"
              min={3}
              max={60}
              step={1}
              value={deltaT}
              onChange={e => setDeltaT(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="results-block">
          {mode === 'flow' ? (
            <>
              <div className="result-row">
                <span className="result-label">м³/час</span>
                <span className="result-value">{result.m3h}</span>
              </div>
              <div className="result-row">
                <span className="result-label">л/мин</span>
                <span className="result-value">{result.lmin}</span>
              </div>
              <div className="result-row">
                <span className="result-label">л/сек</span>
                <span className="result-value">{result.lsec}</span>
              </div>
            </>
          ) : (
            <div className="result-row">
              <span className="result-label">Q, кВт</span>
              <span className="result-value">{result.power}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowCalculator; 
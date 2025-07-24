import React, { useState, useEffect } from 'react';
import './FlowCalculator.css';

const FLUIDS = [
  {
    value: 'water',
    label: 'Вода',
    getProperties: (temp) => {
      // Аппроксимация свойств воды в диапазоне 0-100°C
      const density = 1000 * (1 - (temp - 4) * (temp - 4) / 800000);
      const viscosity = 1.79e-6 * Math.exp(-0.024 * temp);
      return {
        density: parseFloat(density.toFixed(1)),
        viscosity: parseFloat(viscosity.toFixed(8)),
      };
    },
  },
  {
    value: 'glycol30',
    label: '30% этиленгликоль',
    getProperties: (temp) => {
      const density = 1058 - 0.3 * temp;
      const viscosity = 4.5e-6 * Math.exp(-0.02 * temp);
      return {
        density: parseFloat(density.toFixed(1)),
        viscosity: parseFloat(viscosity.toFixed(8)),
      };
    },
  },
  {
    value: 'glycol50',
    label: '50% этиленгликоль',
    getProperties: (temp) => {
      const density = 1088 - 0.35 * temp;
      const viscosity = 8.0e-6 * Math.exp(-0.025 * temp);
      return {
        density: parseFloat(density.toFixed(1)),
        viscosity: parseFloat(viscosity.toFixed(8)),
      };
    },
  },
];

const PIPE_MATERIALS = [
  { value: 'ppr', label: 'Полимерная', roughness: 0.000007 },
  { value: 'copper', label: 'Медь', roughness: 0.0000015 },
  { value: 'stainless', label: 'Нержавеющая сталь', roughness: 0.000045 },
];

const FLOW_UNITS = [
  { value: 'm3h', label: 'м³/час', toM3s: (v) => v / 3600 },
  { value: 'lmin', label: 'л/мин', toM3s: (v) => v / 60000 },
  { value: 'm3s', label: 'м³/с', toM3s: (v) => v },
];

function formatNumber(num, decimals = 4) {
  if (num === '-' || isNaN(num)) return '-';
  if (Math.abs(num) < 0.0001 && num !== 0) {
    return Number(num).toExponential(decimals);
  }
  return Number(num).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

const HydraulicResistanceCalculator = ({ onBack }) => {
  // Исходные данные
  const [pipeMaterial, setPipeMaterial] = useState('ppr');
  const [fluid, setFluid] = useState('water');
  const [temperature, setTemperature] = useState(20);
  const [flowRate, setFlowRate] = useState('1');
  const [flowUnit, setFlowUnit] = useState('m3h');
  const [diameter, setDiameter] = useState('20');
  const [length, setLength] = useState('50');
  const [tooltip, setTooltip] = useState(false);
  // Новое состояние для скорости и режима ручного ввода
  const [velocity, setVelocity] = useState('');
  const [isVelocityManual, setIsVelocityManual] = useState(false);

  // Свойства жидкости
  const fluidObj = FLUIDS.find(f => f.value === fluid);
  const { density, viscosity } = fluidObj.getProperties(Number(temperature));

  // Расчёты
  let results = {
    velocity: '-',
    reynolds: '-',
    friction: '-',
    headloss: '-',
    pressure: '-',
    pressureBar: '-',
  };

  // Проверка на валидность
  const Q = FLOW_UNITS.find(u => u.value === flowUnit).toM3s(Number(flowRate));
  const D = Number(diameter) / 1000; // мм -> м
  const L = Number(length);
  const rho = density;
  const nu = viscosity;
  const roughness = PIPE_MATERIALS.find(m => m.value === pipeMaterial).roughness;

  let autoVelocity = '-';
  if (
    !isNaN(Q) && Q > 0 &&
    !isNaN(D) && D > 0 &&
    !isNaN(L) && L > 0
  ) {
    const A = Math.PI * D * D / 4;
    const V = Q / A;
    autoVelocity = V;
    const Re = V * D / nu;
    // Коэффициент трения λ
    let lambda;
    if (Re < 2000) {
      lambda = 64 / Re;
    } else {
      // Колбрук-Уайт
      const eps = roughness / D;
      let l0 = 0.02;
      let l1;
      let error = 1;
      let iter = 0;
      while (error > 1e-6 && iter < 100) {
        const sqrtL = Math.sqrt(l0);
        l1 = 1 / Math.pow(-2 * Math.log10(eps / 3.7 + 2.51 / (Re * sqrtL)), 2);
        error = Math.abs(l1 - l0);
        l0 = l1;
        iter++;
      }
      lambda = l0;
    }
    // Потери напора
    const hf = lambda * L * V * V / (D * 2 * 9.81);
    // Перепад давления
    const dP = hf * rho * 9.81;
    results = {
      velocity: V.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' м/с',
      reynolds: formatNumber(Re, 2),
      friction: formatNumber(lambda, 6),
      headloss: hf.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' м ст',
      pressure: (dP / 1000).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' кПа',
      pressureBar: formatNumber(dP / 100000, 5) + ' бар',
    };
  }

  // Синхронизация velocity с авто-значением, если не ручной режим
  useEffect(() => {
    if (!isVelocityManual && autoVelocity !== '-') {
      setVelocity(autoVelocity.toFixed(2));
    }
    // eslint-disable-next-line
  }, [flowRate, diameter, flowUnit, isVelocityManual, autoVelocity]);

  // При ручном вводе скорости — пересчитываем расход
  useEffect(() => {
    if (isVelocityManual && velocity !== '' && !isNaN(Number(velocity)) && Number(velocity) > 0 && !isNaN(D) && D > 0) {
      const A = Math.PI * D * D / 4;
      const newQ = Number(velocity) * A; // м³/с
      // Перевести обратно в выбранные единицы расхода
      let newFlowRate = newQ;
      if (flowUnit === 'm3h') newFlowRate = newQ * 3600;
      if (flowUnit === 'lmin') newFlowRate = newQ * 60000;
      if (flowUnit === 'm3s') newFlowRate = newQ;
      setFlowRate(newFlowRate.toFixed(3));
    }
    // eslint-disable-next-line
  }, [velocity, isVelocityManual, diameter, flowUnit]);

  // Сброс ручного режима скорости
  const handleVelocityAuto = () => {
    setIsVelocityManual(false);
    if (autoVelocity !== '-') setVelocity(autoVelocity.toFixed(2));
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
          <div className="card-title">Гидравлическое<br />сопротивление<br />трубопровода</div>
        </div>
        <div className="results-block">
          <div className="result-row">
            <span className="result-label">Скорость потока (V)</span>
            <span className="result-value">{results.velocity}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Потери напора (hₓ)</span>
            <span className="result-value">{results.headloss}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Перепад давления (ΔP)</span>
            <span className="result-value">{results.pressure}</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="velocity">Скорость потока, м/с</label>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input
              type="number"
              id="velocity"
              min="0.01"
              max="5"
              step="0.01"
              value={velocity}
              onChange={e => {
                setIsVelocityManual(true);
                setVelocity(e.target.value);
              }}
              inputMode="decimal"
              style={{flex:2}}
            />
            <button
              type="button"
              aria-label="Авто-режим скорости"
              title="Сбросить ручной режим и вернуть авто-расчёт скорости"
              onClick={handleVelocityAuto}
              style={{
                flex: 'none',
                background: !isVelocityManual ? '#2196f3' : '#eaf6ff',
                border: !isVelocityManual ? '2px solid #1976d2' : '1px solid #b3e0ff',
                borderRadius: 6,
                padding: '0 8px',
                height: 32,
                cursor: 'pointer',
                color: !isVelocityManual ? '#fff' : '#2196f3',
                fontWeight: !isVelocityManual ? 600 : 400,
                boxShadow: !isVelocityManual ? '0 0 0 2px #90caf9' : 'none',
                transition: 'all 0.18s',
                outline: !isVelocityManual ? '2px solid #1976d2' : 'none',
              }}
              disabled={!isVelocityManual && velocity === autoVelocity.toFixed(2)}
            >
              Авто
            </button>
          </div>
          <div className="slider-block">
            <input
              type="range"
              id="velocity-range"
              min="0.01"
              max="5"
              step="0.01"
              value={velocity}
              onChange={e => {
                setIsVelocityManual(true);
                setVelocity(e.target.value);
              }}
              style={{width:'100%'}}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Расход жидкости</label>
          <div className="units-row">
            <input
              type="number"
              id="flow-rate"
              step="0.001"
              min="0"
              placeholder="Введите расход"
              value={flowRate}
              onChange={e => setFlowRate(e.target.value)}
              inputMode="numeric"
              style={{flex: 2}}
            />
            <select
              id="flow-unit"
              value={flowUnit}
              onChange={e => setFlowUnit(e.target.value)}
              style={{flex: 1, maxWidth: 120}}
            >
              {FLOW_UNITS.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="slider-block">
            <input
              type="range"
              id="flow-rate-range"
              min={flowUnit === 'm3h' ? 0 : flowUnit === 'lmin' ? 0 : 0}
              max={flowUnit === 'm3h' ? 10 : flowUnit === 'lmin' ? 200 : 1}
              step={flowUnit === 'm3h' ? 0.01 : flowUnit === 'lmin' ? 1 : 0.001}
              value={flowRate}
              onChange={e => setFlowRate(e.target.value)}
              style={{width: '100%'}}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="length">Длина трубопровода, м</label>
          <input
            type="number"
            id="length"
            step="0.1"
            min="0"
            placeholder="Введите длину"
            value={length}
            onChange={e => setLength(e.target.value)}
            inputMode="numeric"
          />
          <div className="slider-block">
            <input
              type="range"
              id="length-range"
              min="0.1"
              max="100"
              step="0.1"
              value={length}
              onChange={e => setLength(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="diameter">Внутренний диаметр трубы (мм)</label>
          <input
            type="number"
            id="diameter"
            min="10"
            max="50"
            step="1"
            value={diameter}
            onChange={e => setDiameter(e.target.value)}
            inputMode="numeric"
          />
          <div className="slider-block">
            <input
              type="range"
              id="diameter-range"
              min="10"
              max="50"
              step="1"
              value={diameter}
              onChange={e => setDiameter(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group" style={{marginBottom: 18}}>
          <label htmlFor="pipe-material">Материал трубопровода</label>
          <select id="pipe-material" value={pipeMaterial} onChange={e => setPipeMaterial(e.target.value)}>
            {PIPE_MATERIALS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fluid">Жидкость</label>
          <select id="fluid" value={fluid} onChange={e => setFluid(e.target.value)}>
            {FLUIDS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="temperature">Температура жидкости, °C</label>
          <input
            type="number"
            id="temperature"
            min="0"
            max="100"
            step="1"
            value={temperature}
            onChange={e => setTemperature(e.target.value)}
            inputMode="numeric"
          />
          <div className="slider-block">
            <input
              type="range"
              id="temperature-range"
              min="0"
              max="100"
              step="1"
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
            />
          </div>
        </div>
        <div className="fluid-properties" style={{background: 'var(--result-bg)', borderRadius: 8, padding: 15, marginBottom: 20, fontSize: 14}}>
          <div className="fluid-property" style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
            <span className="fluid-property-label" style={{color: '#98a6c7'}}>Плотность:</span>
            <span className="fluid-property-value" id="density-display" style={{color: 'var(--input-text)'}}>{density} кг/м³</span>
          </div>
          <div className="fluid-property" style={{display: 'flex', justifyContent: 'space-between'}}>
            <span className="fluid-property-label" style={{color: '#98a6c7'}}>Кинематическая вязкость:</span>
            <span className="fluid-property-value" id="viscosity-display" style={{color: 'var(--input-text)'}}>{Number(viscosity).toExponential(3)} м²/с</span>
          </div>
        </div>
        <div className={`tooltip${tooltip ? ' active' : ''}`}>
          <strong>Формулы расчёта:</strong>
          <span className="formula">λ = 64/Re (ламинарный) или Колбрук-Уайт{`\n`}hₓ = λ·L·V²/(D·2g){`\n`}ΔP = hₓ·ρ·g</span>
          <b>λ</b> — коэффициент трения<br />
          <b>V</b> — скорость потока, м/с<br />
          <b>Re</b> — число Рейнольдса<br />
          <b>D</b> — диаметр, м<br />
          <b>L</b> — длина, м<br />
          <b>ρ</b> — плотность, кг/м³<br />
          <b>g</b> — ускорение свободного падения, 9.81 м/с²<br />
          <br />
          <b>Примечания:</b>
          <ul style={{margin:0, paddingLeft:20}}>
            <li>Плотность и вязкость автоматически рассчитываются по температуре и типу жидкости</li>
            <li>λ — по Колбруку-Уайту для турбулентного режима</li>
            <li>Результаты: ΔP в Па и бар, hₓ в метрах</li>
          </ul>
        </div>
        <div className="footer-signature">Galf Design</div>
      </div>
      <div className="footer-signature" style={{
        marginTop: 32,
        background: '#f6f7fa',
        borderRadius: 14,
        padding: '22px 16px 20px 16px',
        color: '#232837',
        fontSize: '1.08em',
        lineHeight: 1.85,
        boxShadow: '0 2px 12px 0 rgba(76,201,240,0.07)',
        border: '1.5px solid #e0e4ea',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        textAlign: 'left',
        letterSpacing: 0.01
      }}>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Зачем нужен?</span><br/>
          Этот калькулятор позволяет рассчитать гидравлическое сопротивление трубопровода — потери напора и перепад давления — по длине, диаметру, расходу, материалу и типу жидкости. Это важно для проектирования и проверки систем отопления, водоснабжения, охлаждения, а также для подбора насосов.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Как применяется?</span><br/>
          Введите расход, длину и диаметр трубопровода, выберите материал и тип жидкости. Калькулятор рассчитает скорость потока, потери напора (м) и перепад давления (кПа, бар). Это помогает подобрать насос и убедиться, что система работает в допустимых режимах.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:0}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Используемая методика</span><br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>λ = 64/Re (ламинарный) или Колбрук-Уайт<br/>hₓ = λ·L·V²/(D·2g)<br/>ΔP = hₓ·ρ·g</span><br/>
          <span style={{color:'#4b5a6a'}}>λ</span> — коэффициент трения, <span style={{color:'#4b5a6a'}}>V</span> — скорость, <span style={{color:'#4b5a6a'}}>Re</span> — число Рейнольдса, <span style={{color:'#4b5a6a'}}>D</span> — диаметр, <span style={{color:'#4b5a6a'}}>L</span> — длина, <span style={{color:'#4b5a6a'}}>ρ</span> — плотность, <span style={{color:'#4b5a6a'}}>g</span> — ускорение свободного падения. Методика соответствует СП 30.13330 и инженерным стандартам.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Пример практического применения</span><br/>
          <div style={{background:'#f0f4fa', color:'#232837', borderRadius:8, padding:'13px 15px', margin:'12px 0 0 0', fontSize:'0.99em', lineHeight:1.7, boxShadow:'0 1px 6px #4cc9f00a'}}>
            <b>Задача:</b> Необходимо определить потери давления в полимерной трубе диаметром <b>25 мм</b> и длиной <b>40 м</b> при расходе <b>1.2 м³/ч</b> воды.<br/><br/>
            <b>Решение:</b> Вводим диаметр 25 мм, длину 40 м, расход 1.2 м³/ч, выбираем "Вода" и "Полимерная". Калькулятор покажет скорость, потери напора и перепад давления. Если потери слишком велики — стоит увеличить диаметр или уменьшить длину.<br/>
          </div>
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>О кнопке «Авто»</span><br/>
          Если вы изменяете скорость потока вручную, калькулятор пересчитает расход. Кнопка <b>«Авто»</b> возвращает автоматический расчет скорости по введённому расходу и диаметру трубы. Это удобно для проверки разных режимов работы системы.
        </div>
      </div>
    </div>
  );
};

export default HydraulicResistanceCalculator; 
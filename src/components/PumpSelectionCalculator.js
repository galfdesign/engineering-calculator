import React, { useState } from 'react';
import './FlowCalculator.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

function formatNumber(num, decimals = 2) {
  if (num === '-' || num === undefined || num === null || isNaN(num) || !isFinite(num)) return '-';
  // Ограничим decimals диапазоном 0-20
  const safeDecimals = Math.max(0, Math.min(20, Math.floor(decimals)));
  return Number(num).toLocaleString('ru-RU', {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  });
}

const PumpTabs = {
  FLOW: 'flow',
  PUMP: 'pump',
};

const PIPE_TYPES = [
  { value: 'ppr', label: 'Полипропилен (PPR)', roughness: 0.007 },
  { value: 'pex', label: 'Сшитый полиэтилен (PEX)', roughness: 0.007 },
  { value: 'mp', label: 'Металлопластик', roughness: 0.005 },
  { value: 'cu', label: 'Медь', roughness: 0.0015 },
  { value: 'ss', label: 'Нержавеющая сталь', roughness: 0.015 },
];

const PUMP_OPTIONS = [
  {
    id: '25-40',
    name: 'Grundfos UPS 25-40',
    maxHead: 4.0,
    maxFlow: 2.5,
    workPoint: { flow: 2.0, head: 3.5 },
  },
  {
    id: '25-60',
    name: 'Grundfos UPS 25-60',
    maxHead: 6.0,
    maxFlow: 3.5,
    workPoint: { flow: 3.0, head: 5.0 },
  },
  {
    id: '25-80',
    name: 'Grundfos UPS 25-80',
    maxHead: 8.0,
    maxFlow: 4.5,
    workPoint: { flow: 4.0, head: 6.5 },
  },
];

function FlowTab({ flowData, setFlowData, onFlowCalculated }) {
  const { heatLoad, heatUnit, supplyTemp, returnTemp } = flowData;
  // Расчет расхода
  let flowLh = '-';
  let flowM3h = '-';
  let flowLMin = '-';
  let valid = false;
  if (
    heatLoad > 0 &&
    supplyTemp > returnTemp &&
    !isNaN(heatLoad) &&
    !isNaN(supplyTemp) &&
    !isNaN(returnTemp)
  ) {
    const SPECIFIC_HEAT_CAPACITY = 4.187;
    const DENSITY = 977.8;
    let heatLoadKJ;
    if (heatUnit === 'kW') {
      heatLoadKJ = heatLoad * 3600;
    } else {
      heatLoadKJ = heatLoad * 4.187;
    }
    const deltaT = supplyTemp - returnTemp;
    const calculatedFlow = heatLoadKJ / (SPECIFIC_HEAT_CAPACITY * deltaT);
    flowLh = calculatedFlow;
    flowM3h = calculatedFlow / 1000;
    flowLMin = calculatedFlow / 60;
    valid = true;
    onFlowCalculated(flowM3h);
  }
  return (
    <div>
      <div className="results-block">
        <div className="result-row">
          <span className="result-label">л/час</span>
          <span className="result-value">{formatNumber(flowLh, 1)} <span className="unit"></span></span>
        </div>
        <div className="result-row">
          <span className="result-label">м³/ч</span>
          <span className="result-value">{formatNumber(flowM3h, 3)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">л/мин</span>
          <span className="result-value">{formatNumber(flowLMin, 1)}</span>
        </div>
      </div>
      <div className="form-group">
        <label>Тепловая нагрузка (кВт)</label>
        <input
          type="number"
          value={heatLoad}
          onChange={e => setFlowData(d => ({ ...d, heatLoad: Number(e.target.value) }))}
          step="1"
        />
        <div className="slider-block">
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={heatLoad}
            onChange={e => setFlowData(d => ({ ...d, heatLoad: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Температура на подаче (°C)</label>
        <input
          type="number"
          value={supplyTemp}
          min={20}
          max={120}
          step={1}
          onChange={e => setFlowData(d => ({ ...d, supplyTemp: Number(e.target.value) }))}
        />
        <div className="slider-block">
          <input
            type="range"
            min={20}
            max={120}
            step={1}
            value={supplyTemp}
            onChange={e => setFlowData(d => ({ ...d, supplyTemp: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Температура на обратке (°C)</label>
        <input
          type="number"
          value={returnTemp}
          min={0}
          max={110}
          step={1}
          onChange={e => setFlowData(d => ({ ...d, returnTemp: Number(e.target.value) }))}
        />
        <div className="slider-block">
          <input
            type="range"
            min={0}
            max={110}
            step={1}
            value={returnTemp}
            onChange={e => setFlowData(d => ({ ...d, returnTemp: Number(e.target.value) }))}
          />
        </div>
      </div>
    </div>
  );
}

function PumpTab({ flowM3h, setPressureDropM, pressureDropM }) {
  const [pipeDiameter, setPipeDiameter] = useState(25);
  const [pipeType, setPipeType] = useState('ppr');
  const [pipeLength, setPipeLength] = useState(50);
  const [selectedPump, setSelectedPump] = useState('25-40');
  const [customFlow, setCustomFlow] = useState(flowM3h || 0);
  // Кривые насосов (типовые значения)
  const pumpCurves = {
    '25-40': [
      { flow: 0, head: 4.0 },
      { flow: 0.5, head: 3.9 },
      { flow: 1.0, head: 3.7 },
      { flow: 1.5, head: 3.3 },
      { flow: 2.0, head: 2.7 },
      { flow: 2.5, head: 2.0 },
      { flow: 3.0, head: 1.0 },
    ],
    '25-60': [
      { flow: 0, head: 6.0 },
      { flow: 0.5, head: 5.8 },
      { flow: 1.0, head: 5.5 },
      { flow: 1.5, head: 5.0 },
      { flow: 2.0, head: 4.3 },
      { flow: 2.5, head: 3.5 },
      { flow: 3.0, head: 2.5 },
      { flow: 3.5, head: 1.0 },
    ],
    '25-80': [
      { flow: 0, head: 8.0 },
      { flow: 0.5, head: 7.7 },
      { flow: 1.0, head: 7.3 },
      { flow: 1.5, head: 6.7 },
      { flow: 2.0, head: 6.0 },
      { flow: 2.5, head: 5.2 },
      { flow: 3.0, head: 4.3 },
      { flow: 3.5, head: 3.3 },
      { flow: 4.0, head: 2.2 },
      { flow: 4.5, head: 1.0 },
    ],
  };
  // Расчеты
  const roughness = PIPE_TYPES.find(t => t.value === pipeType).roughness / 1000;
  const density = 977.8;
  const viscosity = 0.000404;
  const d = pipeDiameter / 1000;
  const l = pipeLength;
  const Q = customFlow;
  let velocity = '-';
  let pressureDrop = '-';
  let availablePumps = [];
  if (Q > 0 && d > 0 && l > 0) {
    const area = Math.PI * Math.pow(d / 2, 2);
    const flowM3s = Q / 3600;
    velocity = flowM3s / area;
    const reynolds = (density * velocity * d) / viscosity;
    let frictionFactor;
    if (reynolds < 2300) {
      frictionFactor = 64 / reynolds;
    } else {
      const relativeRoughness = roughness / d;
      frictionFactor = 0.11 * Math.pow(relativeRoughness + 68 / reynolds, 0.25);
    }
    pressureDrop = frictionFactor * (l / d) * (density * Math.pow(velocity, 2)) / 2;
    if (setPressureDropM) setPressureDropM(pressureDrop / 9806.65);
    availablePumps = PUMP_OPTIONS.map(pump => {
      const isAvailable = Q <= pump.maxFlow && pressureDrop / 9806.65 <= pump.maxHead;
      return { ...pump, isAvailable };
    });
  }
  return (
    <div>
      <div className="results-block">
        <div className="result-row">
          <span className="result-label">Гидравлическое сопротивление:</span>
          <span className="result-value">{pressureDrop === '-' ? '-' : formatNumber(pressureDrop / 9806.65, 2) + ' м вод. ст.'}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Скорость потока:</span>
          <span className="result-value">{velocity === '-' ? '-' : formatNumber(velocity, 2) + ' м/с'}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Потери давления:</span>
          <span className="result-value">{pressureDrop === '-' ? '-' : formatNumber(pressureDrop, 0) + ' Па'}</span>
        </div>
      </div>
      {/* График насоса и переключатель */}
      <div className="form-group">
        <select
          value={selectedPump}
          onChange={e => setSelectedPump(e.target.value)}
          className=""
        >
          <option value="25-40">Grundfos UPS 25-40</option>
          <option value="25-60">Grundfos UPS 25-60</option>
          <option value="25-80">Grundfos UPS 25-80</option>
        </select>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={pumpCurves[selectedPump]} margin={{ top: 10, right: 30, left: 0, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="flow" type="number" domain={[0, selectedPump === '25-40' ? 3 : selectedPump === '25-60' ? 3.5 : 4.5]} label={{ value: 'Расход, м³/ч', position: 'insideBottom', offset: -5 }} interval={0} />
            <YAxis dataKey="head" type="number" domain={[0, selectedPump === '25-40' ? 4 : selectedPump === '25-60' ? 6 : 8]} label={{ value: 'Напор, м', angle: -90, position: 'insideLeft', offset: 10 }} />
            <Tooltip formatter={(v, n) => n === 'flow' ? v + ' м³/ч' : v + ' м'} />
            <Line type="monotone" dataKey="head" stroke="#0074D9" dot={{ r: 3 }} />
            {/* Точка рабочего режима пользователя */}
            {customFlow > 0 && pressureDrop > 0 && (
              <ReferenceDot x={customFlow} y={pressureDrop / 9806.65} r={7} fill="#FF4136" stroke="#fff" strokeWidth={2} isFront label={{ value: 'Рабочая точка', position: 'top', fill: '#FF4136', fontSize: 12 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="form-group">
        <label>Внутренний диаметр трубы (мм)</label>
        <input
          type="number"
          value={pipeDiameter}
          min={10}
          max={50}
          step={1}
          onChange={e => setPipeDiameter(Number(e.target.value))}
        />
        <div className="slider-block">
          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={pipeDiameter}
            onChange={e => setPipeDiameter(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Материал трубы</label>
        <select value={pipeType} onChange={e => setPipeType(e.target.value)}>
          {PIPE_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Длина трубопровода (м)</label>
        <input
          type="number"
          value={pipeLength}
          min={1}
          max={200}
          step={1}
          onChange={e => setPipeLength(Number(e.target.value))}
        />
        <div className="slider-block">
          <input
            type="range"
            min={1}
            max={200}
            step={1}
            value={pipeLength}
            onChange={e => setPipeLength(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="form-group" style={{ marginTop: 24 }}>
        <label>Расход для графика (м³/ч)</label>
        <input
          type="number"
          min={0}
          max={selectedPump === '25-40' ? 3 : selectedPump === '25-60' ? 3.5 : 4.5}
          step={0.01}
          value={customFlow}
          onChange={e => setCustomFlow(Number(e.target.value))}
        />
        <div className="slider-block">
          <input
            type="range"
            min={0}
            max={selectedPump === '25-40' ? 3 : selectedPump === '25-60' ? 3.5 : 4.5}
            step={0.01}
            value={customFlow}
            onChange={e => setCustomFlow(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

const PumpSelectionCalculator = ({ onBack }) => {
  const [tab, setTab] = useState(PumpTabs.FLOW);
  const [flowData, setFlowData] = useState({
    heatLoad: 12,
    heatUnit: 'kW',
    supplyTemp: 70,
    returnTemp: 60,
  });
  const [flowM3h, setFlowM3h] = useState(0);
  const [pressureDropM, setPressureDropM] = useState(0);
  const [tooltip, setTooltip] = useState(false);

  // Формулы для тултипа
  const formulaContent = tab === PumpTabs.FLOW ? (
    <>
      <strong>Формула расчета расхода:</strong>
      <span className="formula">G = Q / (c × ΔT)</span>
      <b>G</b> — расход теплоносителя<br />
      <b>Q</b> — тепловая нагрузка (кДж/час)<br />
      <b>c</b> — удельная теплоемкость (4.187 кДж/(кг·°C))<br />
      <b>ΔT</b> — разница температур (°C)<br />
    </>
  ) : (
    <>
      <strong>Формула расчета сопротивления:</strong>
      <span className="formula">ΔP = λ × (L/D) × (ρ×v²)/2</span>
      <b>ΔP</b> — потери давления<br />
      <b>λ</b> — коэффициент трения<br />
      <b>L</b> — длина трубы<br />
      <b>D</b> — диаметр<br />
      <b>ρ</b> — плотность<br />
      <b>v</b> — скорость<br />
      <br />
      <span style={{fontSize:'0.97em'}}>1 м вод. ст. = 9806.65 Па</span>
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
          <div className="card-title">Расчет системы отопления</div>
        </div>
        <div className={`tooltip${tooltip ? ' active' : ''}`}>
          {formulaContent}
        </div>
        <div className="toggle-row">
          <div className="toggle-btn">
            <button
              className={`toggle-option${tab === PumpTabs.FLOW ? ' active' : ''}`}
              onClick={() => setTab(PumpTabs.FLOW)}
            >
              Расход теплоносителя
            </button>
            <button
              className={`toggle-option${tab === PumpTabs.PUMP ? ' active' : ''}`}
              onClick={() => setTab(PumpTabs.PUMP)}
            >
              Подбор насоса
            </button>
          </div>
        </div>
        {/* Блок с результатами */}
        {tab === PumpTabs.FLOW ? (
          <FlowTab flowData={flowData} setFlowData={setFlowData} onFlowCalculated={setFlowM3h} />
        ) : (
          <PumpTab flowM3h={flowM3h} setPressureDropM={setPressureDropM} pressureDropM={pressureDropM} />
        )}
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
          Этот калькулятор помогает подобрать циркуляционный насос для систем отопления и водоснабжения. Он рассчитывает необходимый расход, напор, гидравлическое сопротивление и позволяет сравнить рабочие точки с характеристиками популярных насосов.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Как применяется?</span><br/>
          Введите тепловую нагрузку, температурный график, параметры трубопровода. Калькулятор рассчитает расход, напор, гидравлическое сопротивление и покажет рабочую точку на графике. Это помогает выбрать подходящий насос и проверить параметры системы.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:0}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Используемая методика</span><br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>G = Q / (c × ΔT)<br/>ΔP = λ × (L/D) × (ρ×v²)/2</span><br/>
          <span style={{color:'#4b5a6a'}}>G</span> — расход, <span style={{color:'#4b5a6a'}}>Q</span> — тепловая нагрузка, <span style={{color:'#4b5a6a'}}>c</span> — удельная теплоёмкость, <span style={{color:'#4b5a6a'}}>ΔT</span> — разница температур, <span style={{color:'#4b5a6a'}}>λ</span> — коэффициент трения, <span style={{color:'#4b5a6a'}}>L</span> — длина, <span style={{color:'#4b5a6a'}}>D</span> — диаметр, <span style={{color:'#4b5a6a'}}>ρ</span> — плотность, <span style={{color:'#4b5a6a'}}>v</span> — скорость. Методика соответствует СП 30.13330 и инженерным стандартам.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Пример практического применения</span><br/>
          <div style={{background:'#f0f4fa', color:'#232837', borderRadius:8, padding:'13px 15px', margin:'12px 0 0 0', fontSize:'0.99em', lineHeight:1.7, boxShadow:'0 1px 6px #4cc9f00a'}}>
            <b>Задача:</b> Необходимо подобрать насос для системы отопления мощностью <b>18 кВт</b> с температурным графиком <b>70/50°C</b> и длиной трубопровода <b>40 м</b>.<br/><br/>
            <b>Решение:</b> Вводим мощность 18 кВт, Δt = 20°C, длину 40 м, диаметр и материал трубы. Калькулятор рассчитает расход, напор и покажет рабочую точку на графике. Сравниваем с характеристиками насосов и выбираем подходящий вариант.<br/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PumpSelectionCalculator; 
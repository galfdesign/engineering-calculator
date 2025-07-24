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
    <>
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
          <div className="card-title">Расход по мощности</div>
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
            <label htmlFor="power">Мощность (кВт)</label>
            <input
              type="number"
              id="power"
              min={1}
              max={50}
              step={1}
              value={power}
              onChange={e => setPower(Number(e.target.value))}
            />
            <div className="slider-block">
              <input
                type="range"
                min={1}
                max={50}
                step={1}
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
                  {Object.entries(FLOW_UNITS).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
            <input
              type="number"
                id="flow"
                min={unitObj.min}
                max={unitObj.max}
                step={unitObj.step}
                value={flow}
                onChange={e => setFlow(Number(e.target.value))}
              />
              <div className="slider-block">
                <input
                  type="range"
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
            <label htmlFor="deltaT">Перепад температур Δt (°C)</label>
          <input
            type="number"
            id="deltaT"
              min={1}
              max={50}
            step={1}
            value={deltaT}
            onChange={e => setDeltaT(Number(e.target.value))}
          />
          <div className="slider-block">
            <input
              type="range"
                min={1}
                max={50}
              step={1}
              value={deltaT}
              onChange={e => setDeltaT(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={`tooltip${tooltip ? ' active' : ''}`} style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          width: '400px',
          zIndex: 1000
        }}>
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
        <div className="footer-signature">Galf Design</div>
      </div>
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
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Что такое расход теплоносителя?</span><br/>
          Расход теплоносителя — это количество жидкости (например, воды или антифриза), которое проходит через систему отопления, теплообменник, радиатор или иной агрегат за определённое время. Обычно выражается в м³/ч, л/мин, л/сек. Расход определяет, сколько тепла может быть перенесено от источника к потребителю. Если расход слишком мал — система не отдаёт нужную мощность. Если слишком велик — оборудование работает неэффективно.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Как работает калькулятор</span><br/>
          Калькулятор основан на стандартной теплотехнической формуле:<br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>G = Q / (C × Δt)</span><br/>
          <span style={{color:'#4b5a6a'}}>G</span> — расход теплоносителя (м³/ч), <span style={{color:'#4b5a6a'}}>Q</span> — тепловая мощность (кВт), <span style={{color:'#4b5a6a'}}>C</span> — удельная теплоёмкость жидкости (зависит от состава, например, вода — 1.163 кВт·ч/(м³·°C)), <span style={{color:'#4b5a6a'}}>Δt</span> — разница температур подачи и обратки (°C).<br/>
          Для обратной задачи (мощность по известному расходу):<br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>Q = G × C × Δt</span><br/>
          Вы выбираете тип жидкости, задаёте мощность или расход и температурный перепад — калькулятор автоматически рассчитывает требуемый параметр.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Важность расчёта расхода</span><br/>
          <b>Правильный подбор оборудования.</b> Точный расчёт расхода позволяет выбрать циркуляционный насос, диаметр труб, теплообменник, радиатор или котёл, который будет работать эффективно и не выйдет из строя преждевременно.<br/>
          <b>Энергоэффективность.</b> Оптимальный расход — это не только комфорт, но и экономия электроэнергии и топлива.<br/>
          <b>Безопасность и надёжность.</b> Неправильный расчёт может привести к перегреву, шуму, коррозии и другим проблемам системы.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Использование калькулятора на практике</span><br/>
          Выберите тип жидкости (вода, этиленгликоль, пропиленгликоль, глицерин и их концентрации).<br/>
          Задайте требуемую мощность или расход жидкости.<br/>
          Укажите температурный перепад между подачей и обраткой.<br/>
          Получите расчёт — нужный расход или мощность.<br/>
          Используйте полученные данные для подбора насоса, диаметра труб или теплообменника, а также для проверки существующей системы.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Практические примеры</span><br/>
          <b>Пример 1. Подбор насоса для отопления</b><br/>
          Дано: Мощность 15 кВт, Δt = 20°C, теплоноситель — вода.<br/>
          Расчёт: G = 15 / (1.163 × 20) ≈ 0.65 м³/ч<br/>
          Ответ: Для передачи 15 кВт требуется расход 0,65 м³/ч (10,8 л/мин).<br/><br/>
          <b>Пример 2. Мощность по известному расходу</b><br/>
          Дано: Расход воды 2 м³/ч, Δt = 10°C.<br/>
          Расчёт: Q = 2 × 1.163 × 10 = 23,3 кВт<br/>
          Ответ: Такая система может передать 23,3 кВт тепла.<br/><br/>
          <b>Пример 3. Гликоль вместо воды</b><br/>
          Дано: Мощность 12 кВт, Δt = 15°C, жидкость — пропиленгликоль 40% (C ≈ 1,03).<br/>
          Расчёт: G = 12 / (1.03 × 15) ≈ 0.78 м³/ч<br/>
          Ответ: Необходимый расход — 0,78 м³/ч.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Часто задаваемые вопросы (FAQ)</span><br/>
          <b>1. Какой перепад температур лучше выбирать?</b><br/>
          Обычно для радиаторных систем — 10–20°C, для тёплого пола — 5–10°C. Чем больше Δt — тем меньше расход, но не всегда это подходит (например, для чугунных радиаторов рекомендуется Δt = 15°C).<br/><br/>
          <b>2. Почему для гликоля и глицерина другие коэффициенты?</b><br/>
          Теплоёмкость антифризов ниже, чем у воды — это обязательно учитывать при расчётах, иначе мощности будет не хватать.<br/><br/>
          <b>3. Для чего нужен расчёт расхода?</b><br/>
          Для подбора насоса, труб, радиаторов, теплообменников, а также для проверки правильности работы системы.<br/><br/>
          <b>4. Можно ли использовать калькулятор для систем охлаждения?</b><br/>
          Да, формула универсальна и работает для любых жидкостных тепловых систем: отопление, охлаждение, контуры ГВС, чиллеры и др.<br/><br/>
          <b>5. Почему расчёт расхода важен для энергосбережения?</b><br/>
          Избыточный расход увеличивает энергопотребление насоса и приводит к теплопотерям. Недостаточный — снижает эффективность работы оборудования.
        </div>
      </div>
    </>
  );
};

export default FlowCalculator; 
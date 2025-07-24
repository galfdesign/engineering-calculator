import React, { useState } from 'react';
import './LiquidSpeedCalculator.css';

const flowUnits = [
  { value: 'm3h', label: 'м³/час', toM3s: v => v / 3600, min: 0.1, max: 10, step: 0.1 },
  { value: 'lmin', label: 'л/мин', toM3s: v => v / 60000, min: 1, max: 200, step: 1 },
  { value: 'ls', label: 'л/сек', toM3s: v => v / 1000, min: 0.2, max: 20, step: 0.1 },
];

function formatNumber(num) {
  if (isNaN(num)) return '-';
  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const LiquidSpeedCalculator = ({ onBack }) => {
  const [flowRate, setFlowRate] = useState('1');
  const [flowUnit, setFlowUnit] = useState('m3h');
  const [diameter, setDiameter] = useState('50');
  const [tooltip, setTooltip] = useState(false);

  const currentFlowUnit = flowUnits.find(u => u.value === flowUnit);

  // Расчёт скорости
  let velocity = '-';
  const flow = parseFloat(flowRate);
  const d = parseFloat(diameter);
  if (!isNaN(flow) && !isNaN(d) && d > 0) {
    const flowM3s = currentFlowUnit.toM3s(flow);
    const dMeters = d / 1000;
    const area = Math.PI * Math.pow(dMeters / 2, 2);
    velocity = formatNumber(flowM3s / area);
  }

  return (
    <div className="liquid-container">
      <div className="liquid-calculator" style={{position: 'relative'}}>
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
        <div className="liquid-header">Скорость жидкости<br />в трубопроводе</div>
        <div className="liquid-results">
          <div className="liquid-result-item">
            <span className="liquid-result-label">Скорость жидкости</span>
            <span className="liquid-result-value">{velocity} м/с</span>
          </div>
        </div>
        <div className="liquid-body">
          <div className="liquid-group">
            <div className="units-row">
              <label htmlFor="flow-rate" style={{marginBottom: 0}}>Расход жидкости</label>
              <select
                id="flow-unit"
                value={flowUnit}
                onChange={e => setFlowUnit(e.target.value)}
                style={{width: 'auto', maxWidth: 120}}
              >
                {flowUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <input
              type="number"
              id="flow-rate"
              min="0"
              max="5"
              step="0.01"
              value={flowRate}
              onChange={e => setFlowRate(e.target.value)}
              inputMode="numeric"
            />
            <div className="slider-block">
              <input
                type="range"
                id="flow-rate-range"
                min="0"
                max="5"
                step="0.01"
                value={flowRate}
                onChange={e => setFlowRate(e.target.value)}
              />
            </div>
          </div>
          <div className="liquid-group">
            <label htmlFor="diameter">Внутренний диаметр трубопровода, мм</label>
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
          <strong>Формула расчёта:</strong>
          <span className="formula">V = Q / A</span>
          <b>V</b> — скорость жидкости, м/с<br />
          <b>Q</b> — объемный расход, м³/с<br />
          <b>A</b> — площадь сечения трубы, м²<br />
          <br />
          <b>Примечания:</b>
          <ul style={{margin:0, paddingLeft:20}}>
            <li>Площадь сечения вычисляется по формуле A = π × (D/2)²</li>
            <li>D — внутренний диаметр трубы в метрах</li>
            <li>Расход автоматически конвертируется в м³/с для расчета</li>
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
          Этот калькулятор позволяет определить скорость жидкости в трубопроводе по известному расходу и диаметру трубы. Это важно для проектирования и проверки систем отопления, водоснабжения, охлаждения, а также для подбора насосов и труб.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Как применяется?</span><br/>
          Введите расход жидкости и внутренний диаметр трубы. Калькулятор рассчитает скорость в м/с. Это помогает определить пропускную способность трубопровода при заданном расходе.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:0}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Используемая методика</span><br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>V = Q / A</span><br/>
          <span style={{color:'#4b5a6a'}}>V</span> — скорость, <span style={{color:'#4b5a6a'}}>Q</span> — расход, <span style={{color:'#4b5a6a'}}>A</span> — площадь сечения трубы.<br/>
          Площадь рассчитывается по формуле A = π × (D/2)², где D — внутренний диаметр трубы. Методика соответствует СП 30.13330 и инженерным стандартам.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Пример практического применения</span><br/>
          <div style={{background:'#f0f4fa', color:'#232837', borderRadius:8, padding:'13px 15px', margin:'12px 0 0 0', fontSize:'0.99em', lineHeight:1.7, boxShadow:'0 1px 6px #4cc9f00a'}}>
            <b>Задача:</b> Необходимо определить скорость воды в трубе диаметром <b>25 мм</b> при расходе <b>1.2 м³/ч</b>.<br/><br/>
            <b>Решение:</b> Вводим диаметр 25 мм и расход 1.2 м³/ч. Калькулятор покажет скорость: <b>0.85 м/с</b>. Это значение можно использовать для подбора насоса или проверки пропускной способности системы.<br/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidSpeedCalculator; 
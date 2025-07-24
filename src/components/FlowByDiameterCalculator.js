import React, { useState } from 'react';
import './FlowCalculator.css';

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

const FlowByDiameterCalculator = ({ onBack }) => {
  const [velocity, setVelocity] = useState('1');
  const [diameter, setDiameter] = useState('50');
  const [tooltip, setTooltip] = useState(false);

  // Расчёт расхода
  let results = {
    m3h: '-',
    lmin: '-',
    ls: '-'
  };

  const v = parseFloat(velocity);
  const d = parseFloat(diameter);
  
  if (!isNaN(v) && !isNaN(d) && d > 0) {
    const dMeters = d / 1000;
    const area = Math.PI * Math.pow(dMeters / 2, 2);
    const flowM3s = v * area;
    
    // Конвертация в разные единицы
    results = {
      m3h: formatNumber(flowM3s * 3600),
      lmin: formatNumber(flowM3s * 60000),
      ls: formatNumber(flowM3s * 1000)
    };
  }

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
          <div className="card-title">Расход жидкости<br />по диаметру</div>
        </div>
        <div className="results-block">
          <div className="result-row">
            <span className="result-label">Расход жидкости</span>
            <span className="result-value">{results.m3h} м³/ч</span>
          </div>
          <div className="result-row">
            <span className="result-label">Расход жидкости</span>
            <span className="result-value">{results.lmin} л/мин</span>
          </div>
          <div className="result-row">
            <span className="result-label">Расход жидкости</span>
            <span className="result-value">{results.ls} л/сек</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="velocity">Скорость жидкости, м/с</label>
          <input
            type="number"
            id="velocityNum"
            step="0.01"
            min="0.5"
            max="2"
            value={velocity}
            onChange={e => setVelocity(e.target.value)}
            inputMode="numeric"
          />
          <div className="slider-block">
            <input
              type="range"
              id="velocity"
              min="0.5"
              max="2"
              step="0.01"
              value={velocity}
              onChange={e => setVelocity(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="diameter">Внутренний диаметр трубопровода, мм</label>
          <input
            type="number"
            id="diameter"
            step="1"
            min="10"
            max="50"
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
        <div className={`tooltip${tooltip ? ' active' : ''}`}>
          <strong>Формула расчёта:</strong>
          <span className="formula">Q = V × A</span>
          <b>Q</b> — объемный расход, м³/с<br />
          <b>V</b> — скорость жидкости, м/с<br />
          <b>A</b> — площадь сечения трубы, м²<br />
          <br />
          <b>Примечания:</b>
          <ul style={{margin:0, paddingLeft:20}}>
            <li>Площадь сечения вычисляется по формуле A = π × (D/2)²</li>
            <li>D — внутренний диаметр трубы в метрах</li>
            <li>Расход автоматически конвертируется в разные единицы измерения</li>
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
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Что такое расход жидкости?</span><br/>
          Расход жидкости — это количество воды или другой жидкости, которое проходит через трубу за определённое время.<br/>
          Расход — один из главных параметров для систем отопления, водоснабжения и охлаждения. Он показывает, сможет ли система передать необходимое количество тепла или обеспечить нужный объём воды.<br/>
          <b>Единицы измерения:</b><br/>
          м³/ч (кубометры в час)<br/>
          л/мин (литры в минуту)<br/>
          л/сек (литры в секунду)
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Как работает калькулятор</span><br/>
          Калькулятор рассчитывает расход жидкости через трубу на основе скорости потока и внутреннего диаметра трубы.<br/>
          В основе расчёта лежит формула:<br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>Q = V × A</span><br/>
          где:<br/>
          Q — расход (м³/с)<br/>
          V — скорость жидкости (м/с)<br/>
          A — площадь сечения трубы (м²), считается как <span style={{fontFamily:'Consolas,Menlo,monospace'}}>A = π × (D/2)²</span>, где D — диаметр трубы в метрах.<br/>
          Вводите значения скорости и диаметра — калькулятор мгновенно показывает расход в разных единицах.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Важность расчёта</span><br/>
          <b>Корректный подбор оборудования:</b> Позволяет определить необходимую производительность насоса и оптимальный диаметр трубы.<br/>
          <b>Безопасность и надёжность:</b> Избыточная скорость или малый диаметр приводит к шуму, повышенному износу и даже авариям.<br/>
          <b>Экономия энергии:</b> Помогает подобрать оптимальный расход для энергоэффективной работы системы.<br/>
          <b>Соответствие нормативам:</b> Правильные расчёты обеспечивают соответствие строительным и инженерным стандартам.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Использование калькулятора</span><br/>
          Введите скорость жидкости (м/с) — обычно в отопительных системах 0.7–1.5 м/с.<br/>
          Укажите внутренний диаметр трубы (мм) — согласно проекту или выбранной трубе.<br/>
          Посмотрите результаты — расход сразу отображается в м³/ч, л/мин и л/сек.<br/>
          Используйте данные для подбора насоса, проверки пропускной способности, выбора трубы или оценки эффективности системы.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Практические примеры применения</span><br/>
          <b>Пример 1. Подбор насоса для водяного отопления</b><br/>
          Задано: скорость 1,2 м/с, диаметр трубы 25 мм.<br/>
          Калькулятор покажет расход: 0.85 м³/ч (или 14.2 л/мин). Это значение используют для подбора насоса и проверки, хватит ли пропускной способности трубы.<br/><br/>
          <b>Пример 2. Проверка существующей системы</b><br/>
          В старом доме диаметр трубы 32 мм, скорость измерена — 0,9 м/с. Вводим данные: получаем расход 2,6 м³/ч (или 43,5 л/мин). Если требуется больше, значит нужно менять трубу или насос.<br/><br/>
          <b>Пример 3. Оценка скорости воды</b><br/>
          Есть труба 20 мм и известный расход 0,4 м³/ч. Инженер может пересчитать, какая скорость потока (чтобы не превышать нормы по шуму и гидравлическим потерям).
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Часто задаваемые вопросы (FAQ)</span><br/>
          <b>1. Какую скорость воды выбирать?</b><br/>
          Для отопления — обычно 0,7–1,3 м/с. Для водоснабжения допускается до 2 м/с. Слишком большая скорость вызывает шум и износ, слишком маленькая — опасность завоздушивания.<br/><br/>
          <b>2. Можно ли применять калькулятор для антифриза?</b><br/>
          Да, расход считается одинаково, но вязкость жидкости может повлиять на выбор насоса.<br/><br/>
          <b>3. Что делать, если получился слишком большой расход?</b><br/>
          Выбрать трубу большего диаметра или уменьшить скорость потока.<br/><br/>
          <b>4. Нужно ли учитывать толщину стенки трубы?</b><br/>
          Нет, указывается внутренний диаметр трубы, по которому реально движется жидкость.<br/><br/>
          <b>5. Почему важно переводить расход в разные единицы?</b><br/>
          В проектах и паспортах оборудования часто указывают разные единицы, калькулятор делает пересчёт автоматически для удобства.
        </div>
      </div>
    </div>
  );
};

export default FlowByDiameterCalculator; 
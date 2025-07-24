import React, { useState, useEffect } from 'react';

const minCircle = 10, maxCircle = 40, circleLen = 2 * Math.PI * 55;

function lerpColor(a, b, t) {
  let ah = parseInt(a.replace('#',''), 16), bh = parseInt(b.replace('#',''), 16);
  let ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  let br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  let rr = Math.round(ar + t * (br - ar)), rg = Math.round(ag + t * (bg - ag)), rb = Math.round(ab + t * (bb - ab));
  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + (rb << 0)).toString(16).slice(1,7);
}
function getSlabColor(temp) {
  let t = (temp - 10) / 30;
  t = Math.max(0, Math.min(1, t));
  return lerpColor("#e9ecef", "#ff4040", t);
}

const lambdaOptions = [
  { value: 0.030, label: 'Пенопласт 0.030' },
  { value: 0.035, label: 'Пенополистирол 0.035' },
  { value: 0.040, label: 'Минвата 0.040' },
  { value: 0.045, label: 'Пеностекло 0.045' },
];

export default function PlateHeatFlowCalculator({ onBack }) {
  const [airTemp, setAirTemp] = useState(22);
  const [airSpeed, setAirSpeed] = useState(0);
  const [tempPlate, setTempPlate] = useState(29);
  const [insThick, setInsThick] = useState(50);
  const [lambda, setLambda] = useState(0.035);
  const [tBelow, setTBelow] = useState(0);
  const [tooltip, setTooltip] = useState(false);

  // Для кругового range
  const percent = (airTemp - minCircle) / (maxCircle - minCircle);
  const dashoffset = circleLen * (1 - percent);

  // Цвет плиты
  const slabColor = getSlabColor(tempPlate);

  // Расчеты
  const dt = tempPlate - airTemp;
  const alpha_i = (dt !== 0)
    ? 5.3 * (Math.pow(273 + tempPlate, 4) - Math.pow(273 + airTemp, 4)) / (Math.pow(100, 4) * (tempPlate - airTemp))
    : 0;
  const alpha_k = (dt > 0) ? 3.6 * Math.pow(dt, 0.18) + 8.0 * Math.pow(airSpeed, 0.6) : 0;
  const q_rad = alpha_i * dt;
  const q_conv = alpha_k * dt;
  const q_up = q_rad + q_conv;
  const R = (insThick / 1000) / lambda;
  const q_down = R > 0 ? (tempPlate - tBelow) / R : 0;

  return (
    <div className="calculator" style={{
      background:'#222931', maxWidth:370, margin:'18px auto 0 auto', borderRadius:16, boxShadow:'0 2px 16px rgba(70, 118, 250, 0.10)', padding:'7px 2vw', fontSize:'1rem', lineHeight:1.5, color:'#e2e7ed', position:'relative'
    }}>
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
      <h2 style={{textAlign:'center', color:'#98b6ff', fontSize:'1.2rem', marginBottom:14}}>Тепловой поток от<br/>бетонной плиты</h2>
      <div className="result-block" style={{marginTop:10, background:'#242c36', padding:'12px 9px 7px 9px', borderRadius:8, boxShadow:'0 2px 8px rgba(70, 118, 250, 0.06)', fontSize:'0.98rem', color:'#e2e7ed'}}>
        <b>ΔT (плита-воздух):</b> {dt.toFixed(1)} °C<br/>
        <b>α<sub>и</sub> (излучение):</b> {alpha_i.toFixed(2)} Вт/(м²·К)<br/>
        <b>α<sub>к</sub> (конвекция):</b> {alpha_k.toFixed(2)} Вт/(м²·К)<hr style={{border:'none', borderTop:'1px solid #3a4a5e'}}/>
        <b>Излучение вверх:</b> {q_rad.toFixed(1)} Вт/м²<br/>
        <b>Конвекция вверх:</b> {q_conv.toFixed(1)} Вт/м²<br/>
        <b>Поток вниз (через утеплитель):</b> {q_down.toFixed(1)} Вт/м²
        <span className="highlight-result" style={{fontSize:'1.28em', color:'#53b4ff', fontWeight:'bold', margin:'12px 0 6px 0', display:'block'}}>Итого вверх: {q_up.toFixed(1)} Вт/м²</span>
      </div>
      <div className="knob-label" style={{color:'#bbc7d4', marginBottom:8, fontSize:'0.98rem', textAlign:'center'}}>Температура воздуха, °C</div>
      <div className="circle-range-row" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'0.2em', marginBottom:8}}>
        <button className="circle-range-btn" style={{width:36, height:36, borderRadius:'50%', border:'none', background:'#2e3742', color:'#fff', fontSize:'1.7em', fontWeight:'bold', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.09)', display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none'}} onClick={()=>setAirTemp(v=>Math.max(minCircle, v-1))}>–</button>
        <div className="circle-range-wrapper" style={{position:'relative', width:138, height:138}}>
          <svg className="circle-range-svg" width="138" height="138" style={{transform:'rotate(0deg)'}}>
            <circle className="circle-range-track" cx="69" cy="69" r="55" style={{stroke:'#444d57', strokeWidth:18, fill:'none'}}/>
            <circle className="circle-range-fill" cx="69" cy="69" r="55" style={{stroke:'#53b4ff', strokeWidth:18, fill:'none', transition:'stroke-dashoffset 0.25s'}} strokeDasharray={circleLen} strokeDashoffset={dashoffset}/>
            <text x="69" y="65" className="circle-range-text" style={{fill:'#fff', fontSize:'2.2em', fontWeight:'bold', textAnchor:'middle', dominantBaseline:'middle'}}>{airTemp}</text>
            <text x="69" y="99" className="circle-range-label" style={{fill:'#8ea5c8', fontSize:'1em', textAnchor:'middle'}}>&deg;C</text>
          </svg>
          <input type="range" min={minCircle} max={maxCircle} step={1} value={airTemp} onChange={e=>setAirTemp(+e.target.value)} className="circle-range-input" style={{position:'absolute', left:0, top:0, width:'100%', height:'100%', opacity:0, cursor:'pointer'}}/>
        </div>
        <button className="circle-range-btn" style={{width:36, height:36, borderRadius:'50%', border:'none', background:'#2e3742', color:'#fff', fontSize:'1.7em', fontWeight:'bold', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.09)', display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none'}} onClick={()=>setAirTemp(v=>Math.min(maxCircle, v+1))}>+</button>
      </div>
      <div className="air-speed-row" style={{marginBottom:10}}>
        <div className="slider-label" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3, fontSize:'0.98rem', color:'#b4bed0'}}>
          <span>Скорость воздуха, м/с</span>
          <span className="slider-value" style={{minWidth:44, textAlign:'right', fontSize:'1em', color:'#53b4ff', fontWeight:'bold'}}>{airSpeed.toFixed(2)}</span>
        </div>
        <input type="range" min={0} max={2} step={0.01} value={airSpeed} onChange={e=>setAirSpeed(+e.target.value)} />
        <div className="air-speed-info" style={{fontSize:'0.85em', color:'#777', marginTop:2}}>
          <span>0: без движения · 0.5: сквозняк · 1.0: вентиляция · 2.0: сильный поток</span>
        </div>
      </div>
      <div className="slab-center-row" style={{display:'flex', justifyContent:'center', marginBottom:0}}>
        <div className="slab-slider-block" style={{borderRadius:11, padding:'6px 16px', boxShadow:'0 2px 7px rgba(0,0,0,0.07)', position:'relative', background:slabColor, textAlign:'center', minHeight:44, maxWidth:370, width:'95%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginBottom:0}}>
          <div className="slab-slider-label" style={{color:'#585858', textAlign:'center', fontSize:'0.92em', marginBottom:1, lineHeight:1.1, fontWeight:500, position:'relative', zIndex:2}}>Температура поверхности плиты, °C</div>
          <div className="slab-temp" style={{fontSize:'1em', fontWeight:'bold', marginBottom:1, marginTop:0, color:'#303030', letterSpacing:'0.01em', position:'relative', zIndex:2}}>{tempPlate}&deg;C</div>
          <input type="range" min={10} max={40} step={1} value={tempPlate} onChange={e=>setTempPlate(+e.target.value)} className="slab-slider" style={{width:'100%', accentColor:'#53b4ff', margin:0, height:20, position:'relative', zIndex:2}}/>
        </div>
      </div>
      <div className="insulation-center-row" style={{display:'flex', justifyContent:'center', marginTop:0, marginBottom:10}}>
        <div className="insulation-block" style={{borderRadius:11, padding:'6px 16px', boxShadow:'0 2px 7px rgba(0,0,0,0.07)', position:'relative', background:'#ffe0b2', textAlign:'center', minHeight:44, maxWidth:370, width:'95%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:0}}>
          <div className="insulation-slider-label" style={{color:'#a96909', textAlign:'center', fontSize:'0.92em', marginBottom:1, lineHeight:1.1, fontWeight:500}}>Толщина утеплителя, мм</div>
          <div className="insulation-value" style={{fontSize:'1em', fontWeight:'bold', marginBottom:1, color:'#a96909'}}>{insThick}</div>
          <input type="range" min={10} max={300} step={1} value={insThick} onChange={e=>setInsThick(+e.target.value)} className="insulation-slider" style={{width:'100%', accentColor:'#ff9800', margin:0, height:20}}/>
        </div>
      </div>
      <div className="slider-row" style={{marginBottom:14, marginTop:0}}>
        <div className="slider-label" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3, fontSize:'0.98rem', color:'#b4bed0'}}>
          <span>λ утеплителя, Вт/(м·К)</span>
          <select value={lambda} onChange={e=>setLambda(+e.target.value)} style={{padding:'3px 7px', fontSize:'0.97em', borderRadius:5, border:'1px solid #506380', background:'#232b33', color:'#e2e7ed'}}>
            {lambdaOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className="slider-row" style={{marginBottom:14, marginTop:0}}>
        <div className="slider-label" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3, fontSize:'0.98rem', color:'#b4bed0'}}>
          <span>Температура под утеплителем, °C</span>
          <span className="slider-value" style={{minWidth:44, textAlign:'right', fontSize:'1em', color:'#53b4ff', fontWeight:'bold'}}>{tBelow}</span>
        </div>
        <input type="range" min={-30} max={20} step={1} value={tBelow} onChange={e=>setTBelow(+e.target.value)} />
      </div>
      <div className="footer-brand" style={{textAlign:'center', color:'#7d95b0', fontSize:'1em', letterSpacing:'0.04em', marginTop:10, fontWeight:'bold'}}>Galf Design</div>
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
        <span className="formula">q<sub>и</sub> = α<sub>и</sub> × ΔT</span>
        <span className="formula">q<sub>к</sub> = α<sub>к</sub> × ΔT</span>
        <span className="formula">q<sub>вниз</sub> = (t<sub>плиты</sub> - t<sub>под утеплителем</sub>) / R</span>
        <b>α<sub>и</sub></b> — коэффициент теплоотдачи излучением, Вт/(м²·К)<br />
        <b>α<sub>к</sub></b> — коэффициент теплоотдачи конвекцией, Вт/(м²·К)<br />
        <b>ΔT</b> — разница температур между плитой и воздухом, °C<br />
        <b>R</b> — термическое сопротивление утеплителя, м²·К/Вт<br />
        <br />
        <b>Примечания:</b>
        <ul style={{margin:0, paddingLeft:20}}>
          <li>α<sub>и</sub> рассчитывается по формуле Стефана-Больцмана</li>
          <li>α<sub>к</sub> зависит от скорости воздуха и разницы температур</li>
          <li>R = толщина / λ</li>
        </ul>
      </div>
    </div>
  );
} 
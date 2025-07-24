import React, { useState } from 'react';
import './FlowCalculator.css';

const FLUIDS = [
  { label: 'Вода', glycol: 0, getDensity: t => 1000 - 0.07 * (t - 4), getExpansion: (tmax, tmin) => 1 - ((1000 - 0.07 * (tmax - 4)) / (1000 - 0.07 * (tmin - 4))) },
  { label: 'Этиленгликоль 20%', glycol: 20, getDensity: t => 1040 - 0.1 * (t - 4), getExpansion: (tmax, tmin) => 1 - ((1040 - 0.1 * (tmax - 4)) / (1040 - 0.1 * (tmin - 4))) },
  { label: 'Этиленгликоль 30%', glycol: 30, getDensity: t => 1055 - 0.11 * (t - 4), getExpansion: (tmax, tmin) => 1 - ((1055 - 0.11 * (tmax - 4)) / (1055 - 0.11 * (tmin - 4))) },
  { label: 'Этиленгликоль 40%', glycol: 40, getDensity: t => 1070 - 0.12 * (t - 4), getExpansion: (tmax, tmin) => 1 - ((1070 - 0.12 * (tmax - 4)) / (1070 - 0.12 * (tmin - 4))) },
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

const STANDARD_TANK_SIZES = [8, 12, 18, 24, 35, 50, 80, 100, 140, 200, 300, 500];

// Таблица коэффициентов расширения n (%) для воды и гликоля (от 20°C до tmax)
const EXPANSION_COEFFS = [
  { tmax: 80, water: 2.53, glycol10: 2.63, glycol20: 3.02, glycol30: 3.41, glycol40: 3.69 },
  { tmax: 90, water: 3.12, glycol10: 3.24, glycol20: 3.63, glycol30: 4.02, glycol40: 4.32 },
  { tmax: 70, water: 2.00, glycol10: 2.10, glycol20: 2.46, glycol30: 2.82, glycol40: 3.09 },
  { tmax: 60, water: 1.51, glycol10: 1.60, glycol20: 1.94, glycol30: 2.27, glycol40: 2.53 },
];

function formatNumber(num) {
  return Number(num).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function roundUpToStandard(val) {
  for (let size of STANDARD_TANK_SIZES) {
    if (val <= size) return size;
  }
  return val;
}

function getExpansionCoeff(tmax, glycol) {
  const row = EXPANSION_COEFFS.find(r => r.tmax === Number(tmax));
  if (!row) return 0.0282;
  if (glycol === 0) return row.water / 100;
  if (glycol === 10) return row.glycol10 / 100;
  if (glycol === 20) return row.glycol20 / 100;
  if (glycol === 30) return row.glycol30 / 100;
  if (glycol === 40) return row.glycol40 / 100;
  return row.water / 100;
}

const ExpansionTankCalculator = ({ onBack }) => {
  const [glycol, setGlycol] = useState(0);
  const [Vsyst, setVsyst] = useState(200);
  const [tmax, setTmax] = useState(60);
  const [PSV, setPSV] = useState(3);
  const [PeUser, setPeUser] = useState(2);
  const [tooltip, setTooltip] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const VsystUsed = Number(Vsyst);
  const n = getExpansionCoeff(tmax, Number(glycol));
  const Ve = VsystUsed * n;
  // Уменьшаем запас воды до 0.3% и минимального значения 3 л
  const Vwr = Math.max(VsystUsed * 0.003, 3);
  const Pe = Number(PeUser);
  // Давление в газовой камере бака: Pe - 0.2, но не менее 0.5 бар
  let P0gas = Pe - 0.2;
  if (P0gas < 0.5) P0gas = 0.5;
  P0gas = Number(P0gas.toFixed(2));
  // Эффективность бака по методике Valtec: (Pe + 1) / (Pe + 1 - P0gas)
  const etaG = (Pe + 1) / (Pe + 1 - P0gas);
  let Vbrutto = '';
  let VbruttoRounded = '';
  if (etaG > 0) {
    Vbrutto = (Ve + Vwr) * etaG;
    VbruttoRounded = roundUpToStandard(Vbrutto);
  }

  return (
    <div className="container">
      <div className="card" style={{position: 'relative'}}>
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label="Назад" style={{position:'absolute',top:12,left:12,width:40,height:40,borderRadius:10,background:'var(--main-blue)',color:'#fff',border:'none',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(76,201,240,0.13)',cursor:'pointer',zIndex:20,transition:'background 0.2s, transform 0.2s',padding:0}} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 4L8 11L15 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <button className="info-btn info-btn-square" tabIndex={0} aria-label="Пояснение" style={{position:'absolute',top:12,right:12,width:40,height:40,borderRadius:10,background:'var(--main-blue)',color:'#fff',border:'none',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(76,201,240,0.13)',cursor:'pointer',zIndex:20,transition:'background 0.2s, transform 0.2s',padding:0}} onClick={() => setTooltip(!tooltip)} onBlur={() => setTooltip(false)} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="white" strokeWidth="2" fill="none"/><rect x="10" y="7" width="2" height="2" rx="1" fill="white"/><rect x="10" y="11" width="2" height="6" rx="1" fill="white"/></svg>
        </button>
        <div className="header-row"><div className="card-title">Расширительный бак<br/>отопления</div></div>
        <div className="results-block">
          <div className="result-row"><span className="result-label">Объем бака (брутто):</span><span className="result-value">{Vbrutto ? Vbrutto.toLocaleString('ru-RU', {maximumFractionDigits:2}) + ' л' : '-'}</span></div>
          <div className="result-row"><span className="result-label">Рекомендуемый бак:</span><span className="result-value">{VbruttoRounded ? VbruttoRounded + ' л' : '-'}</span></div>
          <button className="spoiler-btn" style={{margin:'12px 0',padding:'6px 16px',borderRadius:8,border:'1px solid #ccc',background:'#f7fafd',color:'#1a4b6d',cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:8}} onClick={() => setShowDetails(v => !v)}>
            {showDetails ? 'Скрыть подробности' : 'Показать подробности'}
            <span style={{fontSize:'1.1em',transition:'transform 0.2s',display:'inline-block',transform: showDetails ? 'rotate(180deg)' : 'none'}}>{showDetails ? '▲' : '▼'}</span>
          </button>
          {showDetails && (
            <div className="spoiler-block" style={{background:'#222d38',borderRadius:8,padding:'12px 16px',marginTop:8,color:'#fff'}}>
              <div className="result-row"><span className="result-label">Коэффициент расширения (n):</span><span className="result-value">{n ? (n*100).toFixed(2) + ' %' : '-'}</span></div>
              <div className="result-row"><span className="result-label">Объем расширения (Ve):</span><span className="result-value">{Ve ? Ve.toLocaleString('ru-RU', {maximumFractionDigits:2}) + ' л' : '-'}</span></div>
              <div className="result-row"><span className="result-label">Запас воды (Vwr):</span><span className="result-value">{Vwr ? Vwr.toLocaleString('ru-RU', {maximumFractionDigits:2}) + ' л' : '-'}</span></div>
              <div className="result-row"><span className="result-label">Давление в системе (Pe):</span><span className="result-value">{Pe ? Pe.toFixed(2) + ' бар' : '-'}</span></div>
              <div className="result-row"><span className="result-label">Давление в газовой камере бака:</span><span className="result-value">{P0gas ? P0gas.toFixed(2) + ' бар' : '-'}</span></div>
              <div className="result-row"><span className="result-label">Эффективность (ηG):</span><span className="result-value">{etaG > 0 ? etaG.toFixed(3) : '-'}</span></div>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="vsyst">Объем теплоносителя, л</label>
          <input type="number" id="vsyst" min={1} max={10000} step={1} value={Vsyst} onChange={e => setVsyst(e.target.value)} style={{marginBottom:8}} />
          <input type="range" min={20} max={1000} step={20} value={Vsyst} onChange={e => setVsyst(Number(e.target.value))} style={{width:'100%'}} />
        </div>
        <div className="form-group">
          <label htmlFor="tmax">Максимальная температура, °C</label>
          <select id="tmax" value={tmax} onChange={e => setTmax(Number(e.target.value))}>
            {EXPANSION_COEFFS.map(row => <option key={row.tmax} value={row.tmax}>{row.tmax}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="glycol">Содержание этиленгликоля, %</label>
          <select id="glycol" value={glycol} onChange={e => setGlycol(Number(e.target.value))}>
            <option value={0}>0 (вода)</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="psv">Давление настройки предохранительного клапана, бар</label>
          <input type="number" id="psv" min={1.5} max={10} step={0.1} value={PSV} onChange={e => setPSV(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label htmlFor="peuser">Давление в системе, бар</label>
          <input type="number" id="peuser" min={1.5} max={10} step={0.01} value={PeUser} onChange={e => setPeUser(Number(e.target.value))} />
          <small style={{color: '#666', fontSize: '0.8em'}}>Минимальное давление в системе: 1.5 бар</small>
        </div>
        <div className={`tooltip${tooltip ? ' active' : ''}`} style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%, -50%)',maxWidth:'90vw',width:'400px',zIndex:1000}}>
          <strong>Методика расчёта (отраслевой стандарт):</strong>
          <ul style={{margin:0, paddingLeft:20}}>
            <li>Коэффициент расширения n — по таблице (нагрев от 20°C до tmax)</li>
            <li>Объем расширения: Ve = Vsyst × n</li>
            <li>Запас воды: Vwr = max(Vsyst × 0.3%, 3 л)</li>
            <li>Давление в системе (Pe): минимальное 1.5 бар</li>
            <li>Давление в газовой камере: P0 = Pe - 0.2 (но не менее 0.5 бар)</li>
            <li>Эффективность: ηG = (Pe+1) / (Pe+1 - P0)</li>
            <li>Объем бака: Vbrutto = (Ve + Vwr) × ηG</li>
          </ul>
          <b>Рекомендации:</b>
          <ul style={{margin:0, paddingLeft:20}}>
            <li>Округляйте расчётный объём бака в большую сторону до ближайшего стандартного значения.</li>
            <li>Рекомендуется выбирать бак с запасом по объёму.</li>
            <li>Проверьте давление газа в баке перед запуском системы.</li>
            <li>Минимальное давление в системе отопления должно быть не менее 1.5 бар.</li>
          </ul>
          <b>Таблица коэффициентов расширения (нагрев от 20°C до tmax):</b>
          <table style={{fontSize:'0.9em',marginTop:8}}><thead><tr><th>tmax</th><th>Вода</th><th>Гликоль 10%</th><th>Гликоль 20%</th><th>Гликоль 30%</th><th>Гликоль 40%</th></tr></thead><tbody>
            {EXPANSION_COEFFS.map(row => <tr key={row.tmax}><td>{row.tmax}</td><td>{row.water}</td><td>{row.glycol10}</td><td>{row.glycol20}</td><td>{row.glycol30}</td><td>{row.glycol40}</td></tr>)}
          </tbody></table>
        </div>
        <div className="footer-signature">Galf Design</div>
      </div>
    </div>
  );
};

export default ExpansionTankCalculator; 
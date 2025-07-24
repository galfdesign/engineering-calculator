import React, { useState } from 'react';
import './FlowCalculator.css';
import { REGIONS } from './ventilation/VentilationInputs';

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

const FUEL_PRICES = {
  wood:      { price: 3,   unit: 'кг' },
  coal:      { price: 14,  unit: 'кг' },
  pellets:   { price: 11,  unit: 'кг' },
  briquettes:{ price: 10,  unit: 'кг' },
  diesel:    { price: 54,  unit: 'л' },
  gas:       { price: 6.2, unit: 'м³' },
  lpg:       { price: 25,  unit: 'л' },
  electricity:{ price: 4.3, unit: 'кВт*ч' },
};

const FUEL_DATA = {
  wood:        { calorific: 3.9,  efficiency: 70 },
  coal:        { calorific: 7.5,  efficiency: 70 },
  pellets:     { calorific: 4.3,  efficiency: 80 },
  briquettes:  { calorific: 5,    efficiency: 80 },
  diesel:      { calorific: 11.9, efficiency: 80 },
  gas:         { calorific: 9.3,  efficiency: 92 },
  lpg:         { calorific: 7.5,  efficiency: 92 },
  electricity: { calorific: 1,    efficiency: 100 },
};

function formatNumber(num) {
  return Number(num).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const FuelCostCalculator = ({ onBack }) => {
  const [tooltip, setTooltip] = useState(false);
  const [fuelType, setFuelType] = useState('wood');
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0].name);
  const [area, setArea] = useState(100);
  const [heatLoss, setHeatLoss] = useState(70);
  const [indoorTemp, setIndoorTemp] = useState(21);
  const [efficiency, setEfficiency] = useState(FUEL_DATA[fuelType].efficiency);
  const [fuelPrices, setFuelPrices] = useState(() => {
    const obj = {};
    Object.keys(FUEL_PRICES).forEach(key => {
      obj[key] = FUEL_PRICES[key].price;
    });
    return obj;
  });

  // --- Состояния для ГВС ---
  const [showHotWater, setShowHotWater] = useState(false);
  const [numPeople, setNumPeople] = useState(3);
  const [waterPerPerson, setWaterPerPerson] = useState(60);
  // Температуры для ГВС
  const T_isp = 40;
  const T_hvs = 10;
  const T_boil = 60;

  // Найти регион
  const regionObj = REGIONS.find(r => r.name === selectedRegion);
  const heatingDays = regionObj && regionObj.heatingDays ? regionObj.heatingDays : 214; // если есть, иначе 214
  const t_hp = regionObj && regionObj.t_hp !== undefined ? regionObj.t_hp : -26;
  const k_per = regionObj && regionObj.k_per !== undefined ? regionObj.k_per : 0.34;
  
  // Расчёт теплопотерь с учётом региональных коэффициентов
  const avgHeatLoss = heatLoss * k_per; // Средние теплопотери за сезон с учётом регионального коэффициента
  const annualHeatingNeed = Math.round(area * avgHeatLoss * heatingDays * 24 / 1000); // кВт·ч/год

  // --- Расчёт стоимости 1 кВт·ч и итоговой суммы ---
  const calorific = FUEL_DATA[fuelType].calorific;
  const pricePerUnit = parseFloat(fuelPrices[fuelType]);
  const costPerKWh = pricePerUnit / (calorific * (efficiency / 100));
  const totalCost = Math.round(annualHeatingNeed * costPerKWh);

  // --- Расчёт ГВС ---
  let hotWaterEnergy = 0;
  let hotWaterCost = 0;
  if (showHotWater) {
    const Vgvs = numPeople * waterPerPerson * 365; // годовой расход, л
    const Vboil = Vgvs * (T_isp - T_hvs) / (T_boil - T_hvs); // л
    hotWaterEnergy = Vboil * 1.163 * (T_boil - T_hvs) / 1000; // кВт·ч
    hotWaterCost = hotWaterEnergy * costPerKWh;
  }

  // --- Общие затраты ---
  const totalAll = totalCost + (showHotWater ? Math.round(hotWaterCost) : 0);

  // --- Состояние для спойлера ---
  const [showDetails, setShowDetails] = useState(false);

  // --- Состояние для спойлера по месяцам ---
  const [showMonthly, setShowMonthly] = useState(false);
  const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const monthlyHeating = Math.round(totalCost / 12);
  const monthlyHotWater = showHotWater ? Math.round(hotWaterCost / 12) : 0;
  const monthlyTotal = monthlyHeating + monthlyHotWater;

  // --- Коэффициенты распределения теплопотерь по месяцам (пример для средней полосы РФ) ---
  const heatingCoefs = [0.18,0.16,0.13,0.09,0.05,0,0,0,0.03,0.09,0.13,0.14];
  const monthlyHeatingArr = heatingCoefs.map(coef => Math.round(totalCost * coef));

  const fuelOptions = [
    { value: 'wood', label: 'Дрова сухие' },
    { value: 'coal', label: 'Уголь каменный' },
    { value: 'pellets', label: 'Пеллеты' },
    { value: 'briquettes', label: 'Брикеты, ель' },
    { value: 'diesel', label: 'Дизельное топливо' },
    { value: 'gas', label: 'Газ магистральный' },
    { value: 'lpg', label: 'СУГ (пропан-бутан)' },
    { value: 'electricity', label: 'Электроэнергия' },
  ];

  return (
    <div className="container">
      <div className="card" style={{position: 'relative'}}>
        <div className="header-row">
          <div className="card-title">Затраты на отопление (тест)</div>
        </div>
        {/* --- Блок результатов в стиле вентиляции --- */}
        <div className="results" style={{padding:'18px 0 8px 0'}}>
          <div className="result-item" style={{marginBottom:18, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label" style={{fontSize:'1.08em',color:'#a2aabc',marginBottom:2, textAlign:'center', alignSelf:'center'}}>Общие затраты</span>
            <span className="result-value" style={{fontWeight:700, marginTop:2, color:'#4cc9f0', fontSize:'1.22em', textAlign:'center', alignSelf:'center'}}>{totalAll.toLocaleString('ru-RU')} ₽/год</span>
          </div>
          <div style={{width:'100%'}}>
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{
                width: '100%',
                height: 40,
                background: showDetails ? 'rgba(76,201,240,0.13)' : '#232837',
                border: 'none',
                borderRadius: 10,
                color: '#4cc9f0',
                fontSize: '1.08em',
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: showDetails ? 12 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
                boxShadow: showDetails ? '0 2px 8px rgba(76,201,240,0.13)' : '0 1px 3px #0001',
                transition: 'background 0.18s, box-shadow 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(76,201,240,0.18)'}
              onMouseOut={e => e.currentTarget.style.background = showDetails ? 'rgba(76,201,240,0.13)' : '#232837'}
              onMouseDown={e => e.currentTarget.style.background = 'rgba(76,201,240,0.23)'}
              onMouseUp={e => e.currentTarget.style.background = showDetails ? 'rgba(76,201,240,0.13)' : '#232837'}
            >
              <span>{showDetails ? 'Скрыть детали' : 'Показать детали'}</span>
              <svg style={{transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.2s', marginLeft:8}} width="18" height="18" viewBox="0 0 16 16"><path d="M5 3l6 5-6 5" stroke="#4cc9f0" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            </button>
            {showDetails && (
              <div>
                <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                  <span className="result-label">Годовая потребность</span>
                  <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{annualHeatingNeed.toLocaleString('ru-RU')} кВт·ч/год</span>
                </div>
                <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                  <span className="result-label">Стоимость 1 кВт·ч</span>
                  <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{costPerKWh.toFixed(2)} ₽</span>
                </div>
                <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                  <span className="result-label">Суммарные затраты за год</span>
                  <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{totalCost.toLocaleString('ru-RU')} ₽/год</span>
                </div>
                {showHotWater && (
                  <>
                    <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                      <span className="result-label">Энергия на ГВС в год</span>
                      <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{hotWaterEnergy.toLocaleString('ru-RU', {maximumFractionDigits:0})} кВт·ч</span>
                    </div>
                    <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                      <span className="result-label">Затраты на ГВС в год</span>
                      <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{hotWaterCost.toLocaleString('ru-RU', {maximumFractionDigits:0})} ₽/год</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* --- Спойлер по месяцам --- */}
        <div className="results" style={{padding:'0 0 8px 0'}}>
          <button
            onClick={() => setShowMonthly(v => !v)}
            style={{
              width: '100%',
              height: 40,
              background: showMonthly ? 'rgba(76,201,240,0.13)' : '#232837',
              border: 'none',
              borderRadius: 10,
              color: '#4cc9f0',
              fontSize: '1.08em',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: showMonthly ? 12 : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 6,
              boxShadow: showMonthly ? '0 2px 8px rgba(76,201,240,0.13)' : '0 1px 3px #0001',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(76,201,240,0.18)'}
            onMouseOut={e => e.currentTarget.style.background = showMonthly ? 'rgba(76,201,240,0.13)' : '#232837'}
            onMouseDown={e => e.currentTarget.style.background = 'rgba(76,201,240,0.23)'}
            onMouseUp={e => e.currentTarget.style.background = showMonthly ? 'rgba(76,201,240,0.13)' : '#232837'}
          >
            <span>{showMonthly ? 'Скрыть по месяцам' : 'По месяцам'}</span>
            <svg style={{transform: showMonthly ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.2s', marginLeft:8}} width="18" height="18" viewBox="0 0 16 16"><path d="M5 3l6 5-6 5" stroke="#4cc9f0" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </button>
          {showMonthly && (
            <div style={{overflowX:'auto',marginTop:8}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.98em',background:'none'}}>
                <thead>
                  <tr style={{color:'#a2aabc',fontWeight:400}}>
                    <th style={{padding:'6px 8px',textAlign:'left'}}>Месяц</th>
                    <th style={{padding:'6px 8px',textAlign:'right'}}>Отопление</th>
                    {showHotWater && <th style={{padding:'6px 8px',textAlign:'right'}}>ГВС</th>}
                    <th style={{padding:'6px 8px',textAlign:'right'}}>Всего</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m, i) => (
                    <tr key={m} style={{borderBottom:'1px solid #232837'}}>
                      <td style={{padding:'6px 8px', color:'#c7d0e0'}}>{m}</td>
                      <td style={{padding:'6px 8px',textAlign:'right',color:'#4cc9f0',fontWeight:500}}>{monthlyHeatingArr[i].toLocaleString('ru-RU')}</td>
                      {showHotWater && <td style={{padding:'6px 8px',textAlign:'right',color:'#4cc9f0',fontWeight:500}}>{monthlyHotWater.toLocaleString('ru-RU')}</td>}
                      <td style={{padding:'6px 8px',textAlign:'right',color:'#4cc9f0',fontWeight:700}}>{(monthlyHeatingArr[i]+monthlyHotWater).toLocaleString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
        {tooltip && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            width: '420px',
            background: '#232837',
            color: '#e6eaf3',
            borderRadius: 16,
            boxShadow: '0 8px 32px #0007',
            zIndex: 1000,
            padding: '28px 28px 22px 28px',
            fontSize: '1.04em',
            lineHeight: 1.6,
            border: '1.5px solid #4cc9f0',
          }}>
            <button
              onClick={() => setTooltip(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 14,
                background: 'none',
                border: 'none',
                color: '#4cc9f0',
                fontSize: '1.5em',
                cursor: 'pointer',
                zIndex: 1100,
              }}
              aria-label="Закрыть"
            >×</button>
            <div style={{fontWeight:700, fontSize:'1.13em', marginBottom:10, color:'#4cc9f0'}}>Методика расчёта</div>
            <div>
              <b>1. Годовая потребность в отоплении</b><br/>
              <span style={{color:'#a2aabc'}}>Q<sub>год</sub> = S × q<sub>ср</sub> × D × 24 / 1000</span><br/>
              S — площадь дома (м²)<br/>
              q<sub>ср</sub> — средние теплопотери за сезон (Вт/м²)<br/>
              D — длительность отопительного сезона (дней)<br/>
              <br/>
              <b>2. Средние теплопотери за сезон</b><br/>
              <span style={{color:'#a2aabc'}}>q<sub>ср</sub> = q<sub>5дн</sub> × k<sub>пер</sub></span><br/>
              q<sub>5дн</sub> — теплопотери для холодной пятидневки (Вт/м²)<br/>
              k<sub>пер</sub> — региональный коэффициент<br/>
              <br/>
              <b>3. Стоимость 1 кВт·ч</b><br/>
              <span style={{color:'#a2aabc'}}>C<sub>кВт·ч</sub> = Цена / (Уд. теплота × КПД/100)</span><br/>
              Цена — стоимость топлива за единицу<br/>
              Уд. теплота — удельная теплота сгорания топлива (кВт)<br/>
              КПД — КПД оборудования (%)<br/>
              <br/>
              <b>4. Суммарные затраты за год</b><br/>
              <span style={{color:'#a2aabc'}}>Затраты = Q<sub>год</sub> × C<sub>кВт·ч</sub></span><br/>
              <br/>
              <b>5. Горячее водоснабжение (ГВС)</b><br/>
              <span style={{color:'#a2aabc'}}>Q<sub>ГВС</sub> = V<sub>бойл</sub> × 1.163 × (T<sub>бойл</sub> – T<sub>хвс</sub>) / 1000</span><br/>
              V<sub>бойл</sub> = V<sub>ГВС</sub> × (T<sub>исп</sub> – T<sub>хвс</sub>) / (T<sub>бойл</sub> – T<sub>хвс</sub>)<br/>
              V<sub>ГВС</sub> — суточная потребность (л/год)<br/>
              T<sub>исп</sub> — температура на выходе (°C, обычно 40)<br/>
              T<sub>хвс</sub> — температура холодной воды (°C, обычно 10)<br/>
              T<sub>бойл</sub> — температура в бойлере (°C, обычно 60)<br/>
              <br/>
              <b>6. Затраты по месяцам</b><br/>
              <span style={{color:'#a2aabc'}}>Затраты на отопление = Годовые затраты × коэффициент месяца</span><br/>
              <span style={{color:'#a2aabc'}}>Затраты на ГВС = Годовые затраты на ГВС / 12</span><br/>
              <span style={{color:'#a2aabc'}}>Всего = Отопление + ГВС</span><br/>
              <br/>
              <span style={{fontSize:'0.97em',color:'#a2aabc'}}>
                Все формулы приведены для справки и могут быть скорректированы под ваши задачи.
              </span>
            </div>
          </div>
        )}
        <div className="form-group" style={{display:'flex',alignItems:'flex-end',gap:12}}>
          <div style={{flex:1}}>
            <label htmlFor="fuelType">Вид топлива</label>
            <select
              id="fuelType"
              value={fuelType}
              onChange={e => {
                const newFuelType = e.target.value;
                setFuelType(newFuelType);
                setEfficiency(FUEL_DATA[newFuelType].efficiency);
              }}
            >
              {fuelOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{flex:1,margin:0}}>
            <label htmlFor="fuelPrice">Цена</label>
            <div style={{display:'flex',alignItems:'center'}}>
              <input
                id="fuelPrice"
                type="number"
                min={0}
                step={0.01}
                value={fuelPrices[fuelType]}
                onChange={e => {
                  const val = e.target.value;
                  setFuelPrices(prices => ({ ...prices, [fuelType]: val }));
                }}
                style={{
                  width: '100%',
                  height: 37,
                  background: '#232837',
                  border: '1px solid #3a4157',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.08em',
                  textAlign: 'right',
                  borderRadius: 8,
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{fontSize:'1em',color:'#a2aabc',marginLeft:8}}>{FUEL_PRICES[fuelType].unit}</span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="region">Город</label>
          <select
            id="region"
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
          >
            {REGIONS.map(region => (
              <option key={region.name} value={region.name}>{region.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="area">Площадь дома (м²)</label>
          <input
            type="number"
            id="area"
            min={1}
            max={1000}
            step={1}
            value={area}
            onChange={e => setArea(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="heatLoss">Средние теплопотери (Вт/м²) для холодной пятидневки</label>
          <input
            type="number"
            id="heatLoss"
            min={30}
            max={200}
            step={1}
            value={heatLoss}
            onChange={e => setHeatLoss(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="indoorTemp">Внутренняя температура (°C)</label>
          <input
            type="number"
            id="indoorTemp"
            min={10}
            max={30}
            step={1}
            value={indoorTemp}
            onChange={e => setIndoorTemp(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="efficiency">КПД оборудования (%)</label>
          <input
            type="number"
            id="efficiency"
            min={30}
            max={100}
            step={1}
            value={efficiency}
            onChange={e => setEfficiency(Number(e.target.value))}
          />
        </div>
        {/* --- ГВС toggle и поля --- */}
        <div style={{marginTop:32,marginBottom:8,textAlign:'center'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
            <div
              role="button"
              tabIndex={0}
              aria-pressed={showHotWater}
              onClick={() => setShowHotWater(v => !v)}
              onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && setShowHotWater(v => !v)}
              style={{
                width: 40,
                height: 24,
                borderRadius: 12,
                background: showHotWater ? 'rgb(76,201,240)' : 'rgb(204,204,204)',
                position: 'relative',
                transition: 'background 0.2s',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: showHotWater ? '0 0 0 2px #4cc9f055' : undefined,
                border: showHotWater ? '1.5px solid #4cc9f0' : '1.5px solid #232837',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  left: showHotWater ? 18 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px #0002',
                }}
              />
            </div>
            <span style={{fontSize:'1.13em',color:'#c7d0e0',userSelect:'none'}}>Горячее водоснабжение</span>
          </div>
        </div>
        {showHotWater && (
          <>
            <div className="form-group">
              <label htmlFor="numPeople">Количество проживающих</label>
              <input
                id="numPeople"
                type="number"
                min={1}
                max={20}
                step={1}
                value={numPeople}
                onChange={e => setNumPeople(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="waterPerPerson">Расход литров на человека в сутки</label>
              <input
                id="waterPerPerson"
                type="number"
                min={10}
                max={500}
                step={1}
                value={waterPerPerson}
                onChange={e => setWaterPerPerson(Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FuelCostCalculator; 
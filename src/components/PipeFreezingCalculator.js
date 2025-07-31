import React, { useState } from 'react';
import './FlowCalculator.css';

// Данные по температуре почвы для разных регионов и глубин (холодная пятидневка)
const SOIL_TEMPERATURES = {
  'moscow': {
    name: 'Москва',
    freezingDepth: 1.4, // Нормативная глубина промерзания (м)
    depths: {
      0.5: -2.5,   // 0.5м - -2.5°C
      0.8: -1.2,   // 0.8м - -1.2°C
      1.0: -0.8,   // 1.0м - -0.8°C
      1.2: -0.5,   // 1.2м - -0.5°C
      1.5: -0.2,   // 1.5м - -0.2°C
      2.0: 0.5,    // 2.0м - 0.5°C
      2.5: 1.2,    // 2.5м - 1.2°C
      3.0: 2.0     // 3.0м - 2.0°C
    }
  },
  'spb': {
    name: 'Санкт-Петербург',
    freezingDepth: 1.2,
    depths: {
      0.5: -1.8,
      0.8: -0.8,
      1.0: -0.4,
      1.2: -0.2,
      1.5: 0.2,
      2.0: 1.0,
      2.5: 1.8,
      3.0: 2.5
    }
  },
  'ekaterinburg': {
    name: 'Екатеринбург',
    freezingDepth: 1.8,
    depths: {
      0.5: -4.2,
      0.8: -2.8,
      1.0: -2.2,
      1.2: -1.8,
      1.5: -1.2,
      2.0: -0.2,
      2.5: 0.8,
      3.0: 1.5
    }
  },
  'novosibirsk': {
    name: 'Новосибирск',
    freezingDepth: 2.2,
    depths: {
      0.5: -6.5,
      0.8: -4.8,
      1.0: -4.0,
      1.2: -3.5,
      1.5: -2.8,
      2.0: -1.5,
      2.5: -0.2,
      3.0: 0.8
    }
  },
  'krasnodar': {
    name: 'Краснодар',
    freezingDepth: 0.6,
    depths: {
      0.5: 1.2,
      0.8: 2.8,
      1.0: 3.5,
      1.2: 4.0,
      1.5: 4.8,
      2.0: 6.2,
      2.5: 7.5,
      3.0: 8.8
    }
  },
  'sochi': {
    name: 'Сочи',
    freezingDepth: 0.3,
    depths: {
      0.5: 4.5,
      0.8: 6.2,
      1.0: 7.0,
      1.2: 7.8,
      1.5: 8.5,
      2.0: 10.2,
      2.5: 11.8,
      3.0: 13.2
    }
  }
};

// Типы грунтов по нормативным документам
const SOIL_TYPES = {
  'clay': { 
    name: 'Глинистые грунты (глина, суглинок)', 
    lambda: 1.2, 
    density: 1800,
    freezingCoeff: 1.0 
  },
  'sandy': { 
    name: 'Песчаные грунты (песок мелкий, средний)', 
    lambda: 1.8, 
    density: 1600,
    freezingCoeff: 1.1 
  },
  'gravel': { 
    name: 'Крупнообломочные грунты (щебень, гравий)', 
    lambda: 2.5, 
    density: 1900,
    freezingCoeff: 1.3 
  },
  'peat': { 
    name: 'Торфяные грунты', 
    lambda: 0.4, 
    density: 600,
    freezingCoeff: 0.7 
  },
  'loam': { 
    name: 'Суглинистые грунты', 
    lambda: 1.5, 
    density: 1700,
    freezingCoeff: 1.05 
  }
};

// Материалы теплоизоляции
const INSULATION_MATERIALS = {
  'foamed_polyethylene': { name: 'Вспененный полиэтилен', lambda: 0.035, density: 30 },
  'foamed_polyurethane': { name: 'Вспененный полиуретан', lambda: 0.025, density: 40 }
};

// Материалы труб
const PIPE_MATERIALS = {
  'steel': { name: 'Сталь', lambda: 58, density: 7850 },
  'copper': { name: 'Медь', lambda: 401, density: 8960 },
  'plastic': { name: 'Пластик (ППР)', lambda: 0.25, density: 950 },
  'pex': { name: 'PEX-труба', lambda: 0.35, density: 980 }
};

export default function PipeFreezingCalculator({ onBack }) {
  const [pipeDiameter, setPipeDiameter] = useState('32');
  const [pipeLength, setPipeLength] = useState('20');
  const [wallThickness, setWallThickness] = useState('3');
  const [pipeMaterial, setPipeMaterial] = useState('plastic');
  const [initialTemp, setInitialTemp] = useState('20');
  const [region, setRegion] = useState('moscow');
  const [depth, setDepth] = useState('1.0');
  const [soilType, setSoilType] = useState('clay');
  const [insulationThickness, setInsulationThickness] = useState('30');
  const [insulationMaterial, setInsulationMaterial] = useState('foamed_polyethylene');
  const [result, setResult] = useState(null);

  // Получение температуры почвы для выбранного региона, глубины и типа грунта
  const getSoilTemperature = () => {
    const regionData = SOIL_TEMPERATURES[region];
    const soilData = SOIL_TYPES[soilType];
    const depthNum = parseFloat(depth);
    
    // Находим ближайшие значения глубины
    const depths = Object.keys(regionData.depths).map(Number).sort((a, b) => a - b);
    let lowerDepth = depths[0];
    let upperDepth = depths[depths.length - 1];
    
    for (let i = 0; i < depths.length - 1; i++) {
      if (depthNum >= depths[i] && depthNum <= depths[i + 1]) {
        lowerDepth = depths[i];
        upperDepth = depths[i + 1];
        break;
      }
    }
    
    const lowerTemp = regionData.depths[lowerDepth];
    const upperTemp = regionData.depths[upperDepth];
    
    // Линейная интерполяция для базовой температуры
    let baseTemp;
    if (lowerDepth === upperDepth) {
      baseTemp = lowerTemp;
    } else {
      baseTemp = lowerTemp + (upperTemp - lowerTemp) * (depthNum - lowerDepth) / (upperDepth - lowerDepth);
    }
    
    // Корректировка температуры в зависимости от типа грунта
    // Грунты с высокой теплопроводностью быстрее отдают тепло зимой
    // и медленнее нагреваются летом, поэтому зимой они холоднее
    let tempCorrection = 0;
    
    if (soilType === 'gravel') {
      // Крупнообломочные грунты - самые холодные зимой
      tempCorrection = -2.0;
    } else if (soilType === 'sandy') {
      // Песчаные грунты - холоднее среднего
      tempCorrection = -1.0;
    } else if (soilType === 'loam') {
      // Суглинистые - немного холоднее
      tempCorrection = -0.5;
    } else if (soilType === 'clay') {
      // Глинистые - базовая температура
      tempCorrection = 0;
    } else if (soilType === 'peat') {
      // Торфяные - самые теплые зимой
      tempCorrection = 1.5;
    }
    
    return baseTemp + tempCorrection;
  };

  // Динамический расчет при изменении любого параметра
  React.useEffect(() => {
    if (!pipeDiameter || !pipeLength || !wallThickness || !initialTemp || !insulationThickness) {
      setResult(null);
      return;
    }

    const d = parseFloat(pipeDiameter) / 1000; // мм в м
    const L = parseFloat(pipeLength);
    const wall = parseFloat(wallThickness) / 1000; // мм в м
    const T0 = parseFloat(initialTemp);
    const Tsoil = getSoilTemperature();
    const insulationThick = parseFloat(insulationThickness) / 1000; // мм в м
    
    // Получаем характеристики грунта
    const soilData = SOIL_TYPES[soilType];
    const regionData = SOIL_TEMPERATURES[region];
    
    // Расчетная глубина промерзания с учетом типа грунта
    const calculatedFreezingDepth = regionData.freezingDepth * soilData.freezingCoeff;

    // Плотность воды
    const rho = 1000; // кг/м³
    
    // Удельная теплоемкость воды
    const c = 4200; // Дж/(кг·К)
    
    // Теплота кристаллизации воды
    const Lf = 334000; // Дж/кг
    
    // Материалы
    const pipeMat = PIPE_MATERIALS[pipeMaterial];
    const insulationMat = INSULATION_MATERIALS[insulationMaterial];
    
    // Тепловые сопротивления на единицу длины (м·К/Вт)
    const RpipePerMeter = Math.log((d/2) / (d/2 - wall)) / (2 * Math.PI * pipeMat.lambda);
    const RinsulationPerMeter = Math.log((d/2 + insulationThick) / (d/2)) / (2 * Math.PI * insulationMat.lambda);
    const RsoilPerMeter = Math.log((d/2 + insulationThick + 0.5) / (d/2 + insulationThick)) / (2 * Math.PI * soilData.lambda);
    
    const RtotalPerMeter = RpipePerMeter + RinsulationPerMeter + RsoilPerMeter;
    
    // Общее термическое сопротивление для всей трубы
    const Rtotal = RtotalPerMeter * L;
    
    // Площадь поверхности трубы
    const A = Math.PI * d * L;
    
    // Объем воды в трубе
    const V = Math.PI * Math.pow(d/2 - wall, 2) * L;
    const m = V * rho; // масса воды
    
    // Тепло, необходимое для охлаждения до 0°C
    const Qcooling = m * c * (T0 - 0);
    
    // Тепло, необходимое для замерзания
    const Qfreezing = m * Lf;
    
    // Общее тепло
    const Qtotal = Qcooling + Qfreezing;
    
    // Проверяем, может ли вода замерзнуть
    if (Tsoil >= 0) {
      // Даже если замерзание невозможно, теплопотери все равно есть
      const realHeatLossPerMeter = (T0 - Tsoil) / RtotalPerMeter; // Вт/м
      const realHeatLossTotal = realHeatLossPerMeter * L; // Вт для всей трубы
              setResult({
          freezingTimeHours: '∞',
          freezingTimeMinutes: '∞',
          freezingTimeDays: '∞',
          heatLoss: realHeatLossTotal.toFixed(0), // Вт
          waterVolume: (V * 1000).toFixed(2), // л
          waterMass: m.toFixed(2), // кг
          soilTemp: Tsoil.toFixed(1),
          thermalResistance: (RtotalPerMeter * 1000).toFixed(2), // мК/Вт
          calculatedFreezingDepth: calculatedFreezingDepth.toFixed(1),
          willFreeze: false
        });
      return;
    }
    
    // Тепловой поток от трубы к грунту (только если грунт холоднее 0°C)
    const heatTransferPerMeter = (0 - Tsoil) / RtotalPerMeter; // Вт/м
    const heatTransferTotal = heatTransferPerMeter * L; // Вт для всей трубы
    
    // Время замерзания (в секундах)
    const freezingTime = Qtotal / Math.abs(heatTransferTotal);
    
    // Переводим в часы
    const freezingTimeHours = freezingTime / 3600;
    
    // Реальные теплопотери при нормальной работе (при начальной температуре воды)
    const realHeatLossPerMeter = (T0 - Tsoil) / RtotalPerMeter; // Вт/м
    const realHeatLossTotal = realHeatLossPerMeter * L; // Вт для всей трубы
    
    setResult({
      freezingTimeHours: freezingTimeHours.toFixed(2),
      freezingTimeMinutes: (freezingTimeHours * 60).toFixed(0),
      freezingTimeDays: (freezingTimeHours / 24).toFixed(1),
      heatLoss: realHeatLossTotal.toFixed(0), // Вт
      waterVolume: (V * 1000).toFixed(2), // л
      waterMass: m.toFixed(2), // кг
      soilTemp: Tsoil.toFixed(1),
      thermalResistance: (RtotalPerMeter * 1000).toFixed(2), // мК/Вт
      calculatedFreezingDepth: calculatedFreezingDepth.toFixed(1),
      willFreeze: true
    });
  }, [pipeDiameter, pipeLength, wallThickness, pipeMaterial, initialTemp, region, depth, soilType, insulationThickness, insulationMaterial]);

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
          <h2 className="card-title">Время замерзания<br />трубы в грунте</h2>
        </div>

        {/* Результаты */}
        {result && (
          <div className="results-block">
            {result.willFreeze ? (
              <>
                <div className="result-row">
                  <span className="result-label">Время замерзания:</span>
                  <span className="result-value">{result.freezingTimeDays} дн ({result.freezingTimeHours} ч)</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Теплопотери:</span>
                  <span className="result-value">{result.heatLoss} Вт</span>
                </div>
              </>
            ) : (
              <div className="result-row">
                <span className="result-label">Статус:</span>
                <span className="result-value" style={{color: '#4CAF50'}}>Замерзание невозможно</span>
              </div>
            )}
            <div className="result-row">
              <span className="result-label">Температура грунта:</span>
              <span className="result-value">{result.soilTemp} °C</span>
            </div>
            <div className="result-row">
              <span className="result-label">Расчетная глубина промерзания:</span>
              <span className="result-value">{result.calculatedFreezingDepth} м</span>
            </div>
            <div className="result-row">
              <span className="result-label">Термическое сопротивление:</span>
              <span className="result-value">{result.thermalResistance} мК/Вт</span>
            </div>
            <div className="result-row">
              <span className="result-label">Объем воды:</span>
              <span className="result-value">{result.waterVolume} л</span>
            </div>
            <div className="result-row">
              <span className="result-label">Масса воды:</span>
              <span className="result-value">{result.waterMass} кг</span>
            </div>
          </div>
        )}

        {/* Параметры трубы */}
        <div className="form-group">
          <label>Диаметр трубы (мм):</label>
          <input
            type="number"
            min="10"
            max="100"
            step="1"
            value={pipeDiameter}
            onChange={(e) => setPipeDiameter(e.target.value)}
            placeholder="Например: 25"
          />
          <div className="slider-block">
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={pipeDiameter}
              onChange={(e) => setPipeDiameter(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Длина трубы (м):</label>
          <input
            type="number"
            min="1"
            max="1000"
            step="1"
            value={pipeLength}
            onChange={(e) => setPipeLength(e.target.value)}
            placeholder="Например: 100"
          />
          <div className="slider-block">
            <input
              type="range"
              min="1"
              max="1000"
              step="1"
              value={pipeLength}
              onChange={(e) => setPipeLength(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Толщина стенки (мм):</label>
          <input
            type="number"
            min="0.5"
            max="10"
            step="0.1"
            value={wallThickness}
            onChange={(e) => setWallThickness(e.target.value)}
            placeholder="Например: 2.5"
          />
          <div className="slider-block">
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={wallThickness}
              onChange={(e) => setWallThickness(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Материал трубы:</label>
          <select
            value={pipeMaterial}
            onChange={(e) => setPipeMaterial(e.target.value)}
          >
            {Object.entries(PIPE_MATERIALS).map(([key, material]) => (
              <option key={key} value={key}>{material.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Начальная температура воды (°C):</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={initialTemp}
            onChange={(e) => setInitialTemp(e.target.value)}
            placeholder="Например: 20"
          />
          <div className="slider-block">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={initialTemp}
              onChange={(e) => setInitialTemp(e.target.value)}
            />
          </div>
        </div>

        {/* Параметры грунта */}
        <div className="form-group">
          <label>Регион:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {Object.entries(SOIL_TEMPERATURES).map(([key, regionData]) => (
              <option key={key} value={key}>{regionData.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Тип грунта:</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
          >
            {Object.entries(SOIL_TYPES).map(([key, soil]) => (
              <option key={key} value={key}>{soil.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Глубина залегания (м):</label>
          <select
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          >
            <option value="0.5">0.5 м</option>
            <option value="0.8">0.8 м</option>
            <option value="1.0">1.0 м</option>
            <option value="1.2">1.2 м</option>
            <option value="1.5">1.5 м</option>
            <option value="2.0">2.0 м</option>
            <option value="2.5">2.5 м</option>
            <option value="3.0">3.0 м</option>
          </select>
        </div>

        {/* Параметры теплоизоляции */}
        <div className="form-group">
          <label>Толщина теплоизоляции (мм):</label>
          <input
            type="number"
            min="0"
            max="200"
            step="5"
            value={insulationThickness}
            onChange={(e) => setInsulationThickness(e.target.value)}
            placeholder="Например: 50"
          />
          <div className="slider-block">
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={insulationThickness}
              onChange={(e) => setInsulationThickness(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Материал теплоизоляции:</label>
          <select
            value={insulationMaterial}
            onChange={(e) => setInsulationMaterial(e.target.value)}
          >
            {Object.entries(INSULATION_MATERIALS).map(([key, material]) => (
              <option key={key} value={key}>{material.name}</option>
            ))}
          </select>
        </div>

        {/* GalfDesign подпись */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '10px',
          color: '#888',
          fontSize: '14px',
          borderTop: '1px solid #333',
          paddingTop: '15px'
        }}>
          GalfDesign
        </div>

      </div>
    </div>
  );
} 
import React, { useState } from 'react';

const screedMaterials = {
  'Бетон (1.4 Вт/(м·К))': 1.4,
  'Полусухая стяжка (0.8 Вт/(м·К))': 0.8,
  'Сухая стяжка (0.4 Вт/(м·К))': 0.4,
  'Гипсовая стяжка (0.6 Вт/(м·К))': 0.6,
};

const floorCoverings = {
  'Керамогранит (10 мм)': { thickness: 10, lambda: 0.9 },
  'Паркет (15 мм)': { thickness: 15, lambda: 0.2 },
  'Ламинат (8 мм)': { thickness: 8, lambda: 0.15 },
  'ПВХ плитка (3 мм)': { thickness: 3, lambda: 0.25 },
  'Линолеум с подложкой (5 мм)': { thickness: 5, lambda: 0.15 },
  'Кварцвинил (4 мм)': { thickness: 4, lambda: 0.18 },
};

const pipeSpacingAverageCorrection = {
  100: +0.2,
  150:  0.0,
  200: -0.3,
  300: -0.5,
};

export default function NewProcessCalculator({ onBack }) {
  const [targetSurfaceTemp, setTargetSurfaceTemp] = useState(27);
  const [fluidDelta, setFluidDelta] = useState(5);
  const [airTemp, setAirTemp] = useState(22);
  const [screedThicknessMM, setScreedThicknessMM] = useState(50);
  const [screedMaterial, setScreedMaterial] = useState('Бетон (1.4 Вт/(м·К))');
  const [floorFinish, setFloorFinish] = useState('Керамогранит (10 мм)');
  const [pipeSpacing, setPipeSpacing] = useState(150);

  // --- Стяжка и покрытие ---
  const dScreed = screedThicknessMM / 1000;
  const lambdaScreed = screedMaterials[screedMaterial];
  const resistanceScreed = dScreed / lambdaScreed;

  const finish = floorCoverings[floorFinish];
  const dFinish = finish.thickness / 1000;
  const lambdaFinish = finish.lambda;
  const resistanceFinish = dFinish / lambdaFinish;

  const totalResistance = resistanceScreed + resistanceFinish;
  const dTotal = dScreed + dFinish;

  const spacingCorrection = pipeSpacingAverageCorrection[pipeSpacing] || 0;

  // --- Теплотехнические расчеты по методике build-calc.com и EN 1264 ---
  // 1. Сопротивления
  const RAbove = resistanceScreed + resistanceFinish;
  const RBelow = 3.0; // Типовое сопротивление утеплителя
  const RHeatTransferUp = 1/11;
  const RHeatTransferDown = 1/2;
  const RTotalUp = RAbove + RHeatTransferUp;
  const RTotalDown = RBelow + RHeatTransferDown;

  // 2. Тепловые потоки
  const heatFluxCalculated = (targetSurfaceTemp - airTemp) * 11.0;
  const deltaT = heatFluxCalculated * totalResistance;
  const averageFluidTemp = targetSurfaceTemp + deltaT;
  
  // 3. Тепловые потоки вверх и вниз
  const qUp = (averageFluidTemp - airTemp) / RTotalUp;
  const qDown = (averageFluidTemp - airTemp) / RTotalDown;
  const qTotal = qUp + qDown;

  // 4. Температура поверхности (средняя)
  const surfaceAverage = airTemp + qUp * RHeatTransferUp;

  // 5. Градиент между трубами (амплитуда)
  const totalThickness = dTotal;
  const lambdaEquiv = totalThickness > 0 ? totalThickness / RAbove : 1;
  const gradT = lambdaEquiv > 0 ? qUp * (pipeSpacing / 1000) / (2 * lambdaEquiv) : 0;
  const surfaceMax = surfaceAverage + gradT / 2;
  const surfaceMin = surfaceAverage - gradT / 2;

  // 6. Тепловой поток на погонный метр
  const qLinear = qTotal * pipeSpacing / 1000;

  // 7. Температуры теплоносителя
  const supplyTemp = averageFluidTemp + fluidDelta/2;
  const returnTemp = averageFluidTemp - fluidDelta/2;

  // Фактическая дельта температуры поверхности
  const surfaceDelta = surfaceMax - surfaceMin;

  return (
    <div className="calculator" style={{
      background:'#222931', 
      maxWidth:430, 
      margin:'18px auto 0 auto', 
      borderRadius:16, 
      boxShadow:'0 2px 16px rgba(70, 118, 250, 0.10)', 
      padding:'7px 2vw', 
      fontSize:'1rem', 
      lineHeight:1.5, 
      color:'#e2e7ed', 
      position:'relative'
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
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 13h-2v-6h2v6zm0-8h-2V7h2v2z" fill="white"/>
        </svg>
      </button>

      <div style={{marginTop: 10, marginBottom: 20}}>
        <h2 style={{
          margin: '0 0 14px 0',
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#98b6ff',
          textAlign: 'center'
        }}>
          Напольное отопление
        </h2>
        
        <div style={{
          padding: '16px',
          borderRadius: 12,
          background: 'rgba(76, 201, 240, 0.1)',
          border: '1px solid rgba(76, 201, 240, 0.3)',
          marginBottom: 20
        }}>

          
          <div style={{fontSize: '1rem', lineHeight: 1.6}}>
            <div style={{marginBottom: 8}}>
              <strong>Температура подачи:</strong> {supplyTemp.toFixed(1)} °C
            </div>
            <div style={{marginBottom: 8}}>
              <strong>Температура обратки:</strong> {returnTemp.toFixed(1)} °C
            </div>
            
            <div style={{marginBottom: 8}}>
              <strong>Средняя температура поверхности:</strong> {surfaceAverage.toFixed(1)} °C
            </div>
            <div style={{marginBottom: 8}}>
              <strong>Максимальная температура поверхности:</strong> {surfaceMax.toFixed(1)} °C
            </div>
            <div style={{marginBottom: 8}}>
              <strong>Минимальная температура поверхности:</strong> {surfaceMin.toFixed(1)} °C
            </div>
            <div style={{marginBottom: 8, fontSize: '1.28em', color: '#53b4ff', fontWeight: 'bold'}}>
              <strong>Тепловой поток:</strong> {heatFluxCalculated.toFixed(1)} Вт/м²
            </div>
            <div style={{fontStyle: 'italic', color: '#b0b0b0'}}>
              Градиент между трубами: {gradT.toFixed(2)} °C
            </div>
          </div>
        </div>
        
        <div style={{marginBottom: 16}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Средняя температура поверхности (°C):
          </label>
          <input
            type="number"
            value={targetSurfaceTemp}
            onChange={(e) => setTargetSurfaceTemp(+e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="27"
          />
        </div>

        <div style={{marginBottom: 16}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Дельта теплоносителя (°C):
          </label>
          <input
            type="number"
            value={fluidDelta}
            onChange={(e) => setFluidDelta(+e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="5"
          />
        </div>

        <div style={{marginBottom: 16}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Температура воздуха (°C):
          </label>
          <input
            type="number"
            value={airTemp}
            onChange={(e) => setAirTemp(+e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="22"
          />
        </div>

        <div style={{marginBottom: 16}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Толщина стяжки (мм):
          </label>
          <input
            type="number"
            value={screedThicknessMM}
            onChange={(e) => setScreedThicknessMM(+e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="50"
          />
        </div>

        <div style={{marginBottom: 16}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Материал стяжки:
          </label>
          <select
            value={screedMaterial}
            onChange={(e) => setScreedMaterial(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            {Object.keys(screedMaterials).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{marginBottom: 16}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Покрытие пола:
          </label>
          <select
            value={floorFinish}
            onChange={(e) => setFloorFinish(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            {Object.keys(floorCoverings).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{marginBottom: 20}}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: '1.1em',
            fontWeight: 500,
            color: '#e2e7ed'
          }}>
            Шаг укладки трубы (мм):
          </label>
          <select
            value={pipeSpacing}
            onChange={(e) => setPipeSpacing(+e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--toggle-bg)',
              color: 'var(--input-text)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            {[100, 150, 200, 300].map(spacing => (
              <option key={spacing} value={spacing}>{spacing} мм</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 
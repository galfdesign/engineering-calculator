import React from 'react';
import '../FlowCalculator.css';
import TemperatureSlider from './TemperatureSlider';
import AirFlowSlider from './AirFlowSlider';
import PriceSlider from './PriceSlider';
import VentilationResults from './VentilationResults';

export const REGIONS = [
  { name: 'Москва', temp: 6.3, gsop: 5027, t_hp: -26, k_per: 0.34 },
  { name: 'Санкт-Петербург', temp: 6.3, gsop: 4571, t_hp: -23, k_per: 0.32 },
  { name: 'Екатеринбург', temp: 2.1, gsop: 6027, t_hp: -31, k_per: 0.37 },
  { name: 'Новосибирск', temp: 0.2, gsop: 6784, t_hp: -33, k_per: 0.38 },
  { name: 'Красноярск', temp: 2.7, gsop: 7431, t_hp: -36, k_per: 0.40 },
  { name: 'Владивосток', temp: 6.0, gsop: 5107, t_hp: -22, k_per: 0.31 },
  { name: 'Сочи', temp: 14.2, gsop: 1100, t_hp: -8, k_per: 0.28 },
  { name: 'Калининград', temp: 8.3, gsop: 3575, t_hp: -17, k_per: 0.30 },
  { name: 'Казань', temp: 4.0, gsop: 6000, t_hp: -29, k_per: 0.36 },
  { name: 'Самара', temp: 6.1, gsop: 5600, t_hp: -28, k_per: 0.35 },
  { name: 'Ростов-на-Дону', temp: 11.2, gsop: 3900, t_hp: -18, k_per: 0.30 },
  { name: 'Пермь', temp: 1.0, gsop: 6800, t_hp: -31, k_per: 0.37 },
  { name: 'Омск', temp: 2.1, gsop: 7200, t_hp: -34, k_per: 0.39 },
  { name: 'Челябинск', temp: 3.3, gsop: 6200, t_hp: -32, k_per: 0.38 },
  { name: 'Уфа', temp: 3.8, gsop: 6000, t_hp: -31, k_per: 0.37 },
  { name: 'Волгоград', temp: 9.6, gsop: 3700, t_hp: -20, k_per: 0.31 },
  { name: 'Мурманск', temp: -0.4, gsop: 9200, t_hp: -25, k_per: 0.34 },
  { name: 'Архангельск', temp: -1.2, gsop: 9000, t_hp: -27, k_per: 0.35 },
  { name: 'Якутск', temp: -8.0, gsop: 14500, t_hp: -49, k_per: 0.45 },
];

const VentilationInputs = ({ 
  airFlow, 
  setAirFlow, 
  inletTemp, 
  setInletTemp, 
  outletTemp, 
  setOutletTemp,
  heaterType,
  setHeaterType,
  electricityPrice,
  setElectricityPrice,
  gasPrice,
  setGasPrice,
  isNightTariff,
  setIsNightTariff,
  hasRecuperator,
  setHasRecuperator,
  selectedRegion,
  setSelectedRegion,
  power,
  waterFlow,
  electricityConsumption,
  operatingCost,
  gasConsumption,
  gasCost,
  annualEnergy,
  electricityCost,
  gasCostAnnual
}) => {
  return (
    <>
      <VentilationResults
        power={power}
        heaterType={heaterType}
        waterFlow={waterFlow}
        electricityConsumption={electricityConsumption}
        operatingCost={operatingCost}
        gasConsumption={gasConsumption}
        gasCost={gasCost}
        annualEnergy={annualEnergy}
        electricityCost={electricityCost}
        gasCostAnnual={gasCostAnnual}
      />

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px',
        padding: '15px',
        background: 'var(--input-bg)',
        borderRadius: '11px',
        border: '1.5px solid var(--border)'
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#bfc9d1', fontSize: 14, marginBottom: 4 }}>Ночной тариф</span>
          <label 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => setIsNightTariff(!isNightTariff)}
          >
            <div style={{
              width: '40px',
              height: '24px',
              borderRadius: '12px',
              background: isNightTariff ? 'var(--main-blue)' : '#ccc',
              position: 'relative',
              transition: 'background 0.2s'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: isNightTariff ? '18px' : '2px',
                transition: 'left 0.2s'
              }}/>
            </div>
          </label>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#bfc9d1', fontSize: 14, marginBottom: 4 }}>Рекуператор</span>
          <label 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => setHasRecuperator(!hasRecuperator)}
          >
            <div style={{
              width: '40px',
              height: '24px',
              borderRadius: '12px',
              background: hasRecuperator ? 'var(--main-blue)' : '#ccc',
              position: 'relative',
              transition: 'background 0.2s'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: hasRecuperator ? '18px' : '2px',
                transition: 'left 0.2s'
              }}/>
            </div>
          </label>
        </div>
      </div>

      <TemperatureSlider value={outletTemp} setValue={setOutletTemp} label="Требуемая температура в помещении, °C" />

      <AirFlowSlider value={airFlow} setValue={setAirFlow} label="Расход воздуха, м³/ч" />

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label>Тип нагревателя</label>
        <div className="toggle-row">
          <div className="toggle-btn">
            <button
              className={`toggle-option${heaterType === 'water' ? ' active' : ''}`}
              onClick={() => setHeaterType('water')}
            >
              Водяной
            </button>
            <button
              className={`toggle-option${heaterType === 'electric' ? ' active' : ''}`}
              onClick={() => setHeaterType('electric')}
            >
              Электрический
            </button>
          </div>
        </div>
      </div>

      {heaterType === 'water' ? (
        <PriceSlider
          value={gasPrice}
          setValue={setGasPrice}
          label="Стоимость газа, ₽/1000 м³"
          min={0}
          max={10000}
          step={100}
          unit="₽"
        />
      ) : (
        <PriceSlider
          value={electricityPrice}
          setValue={setElectricityPrice}
          label="Стоимость электроэнергии, ₽/кВт·ч"
          min={0}
          max={20}
          step={0.1}
          unit="₽"
        />
      )}

      <div className="form-group" style={{ marginBottom: '18px' }}>
        <label>Регион (климат)</label>
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          style={{ width: '100%', fontSize: '1em', borderRadius: 11, border: '1.5px solid var(--border)', background: 'var(--input-bg)', color: 'var(--input-text)', padding: '11px 13px', marginTop: 2 }}
        >
          {REGIONS.map(region => (
            <option key={region.name} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default VentilationInputs; 
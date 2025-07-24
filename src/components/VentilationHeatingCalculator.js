import React, { useState } from 'react';
import './FlowCalculator.css';
import VentilationInputs from './ventilation/VentilationInputs';
import VentilationResults from './ventilation/VentilationResults';
import { 
  calculatePower, 
  calculateWaterFlow, 
  calculateElectricityConsumption, 
  calculateOperatingCost,
  calculateGasConsumption,
  calculateGasCost
} from './ventilation/VentilationUtils';
import { REGIONS } from './ventilation/VentilationInputs';

const VentilationHeatingCalculator = ({ onBack }) => {
  const [heaterType, setHeaterType] = useState('water');
  const [airFlow, setAirFlow] = useState(300);
  const [inletTemp, setInletTemp] = useState(-20);
  const [outletTemp, setOutletTemp] = useState(20);
  const [supplyTemp, setSupplyTemp] = useState(70);
  const [returnTemp, setReturnTemp] = useState(50);
  const [electricityPrice, setElectricityPrice] = useState(5);
  const [gasPrice, setGasPrice] = useState(6000);
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [daysPerMonth, setDaysPerMonth] = useState(30);
  const [isNightTariff, setIsNightTariff] = useState(false);
  const [hasRecuperator, setHasRecuperator] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Москва');

  // Получаем среднегодовую температуру выбранного города
  const regionObj = REGIONS.find(r => r.name === selectedRegion);
  const regionTemp = regionObj ? regionObj.temp : -13;

  const power = calculatePower(airFlow, regionTemp, outletTemp, hasRecuperator);
  const waterFlow = heaterType === 'water' ? calculateWaterFlow(power, supplyTemp, returnTemp) : null;
  const electricityConsumption = heaterType === 'electric' ? 
    calculateElectricityConsumption(power, hoursPerDay, daysPerMonth, isNightTariff) : null;
  const operatingCost = heaterType === 'electric' ? 
    calculateOperatingCost(electricityConsumption, electricityPrice, isNightTariff) : null;
  const gasConsumption = heaterType === 'water' ? 
    calculateGasConsumption(power, hoursPerDay, daysPerMonth) : null;
  const gasCost = heaterType === 'water' ? 
    calculateGasCost(gasConsumption, gasPrice) : null;

  // Используем значения из состояния, чтобы расчёты зависели от слайдеров
  const V = airFlow / 3600; // м³/с — переводим из м³/ч
  const rho = 1.29; // кг/м³ (по методике)
  const c = 1.005; // кДж/(кг·°C)
  const tariff = electricityPrice; // ₽/кВт·ч — слайдер
  const gsop = regionObj && regionObj.gsop ? regionObj.gsop : 5000;
  const gasPriceCurrent = gasPrice; // ₽/1000 м³ — слайдер

  // Корректировка ГСОП по фактической внутренней температуре
  const standardIndoorTemp = 18; // °C, стандарт для ГСОП
  const heatingDays = regionObj && regionObj.heatingDays ? regionObj.heatingDays : 214;
  const gsopCorrected = gsop + (outletTemp - standardIndoorTemp) * heatingDays;

  // Годовое потребление по скорректированному ГСОП (кВт·ч)
  let annualEnergy = Math.round(airFlow * rho * c * gsopCorrected * 24 / 3699);
  if (hasRecuperator) {
    annualEnergy = Math.round(annualEnergy * 0.3); // снижение на 70%
  }

  // Расчет стоимости на электричестве с учетом ночного тарифа
  let electricityCost = annualEnergy * tariff;
  if (isNightTariff) {
    // 8 часов в сутки по половинной цене, 16 часов по полной
    // Средневзвешенный тариф: (8*0.5 + 16*1)/24 = 0.6667
    const effectiveTariff = tariff * (8 * 0.5 + 16 * 1) / 24;
    electricityCost = Math.round(annualEnergy * effectiveTariff);
  }

  // Стоимость на газе (оставим для справки, но тариф и КПД не меняем)
  const boilerEfficiency = 0.9;
  const gasCalorificValue = 8.9;
  const gasNeeded = annualEnergy / (gasCalorificValue * boilerEfficiency);
  const gasCostAnnual = Math.round(gasNeeded * (gasPriceCurrent / 1000));

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
          <div className="card-title">Подогрев вентиляции</div>
        </div>

        {tooltip && (
          <div className="tooltip active" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            width: '400px',
            zIndex: 1000
          }}>
            <strong>Методика расчета:</strong>
            <span className="formula">
              Q = L × ρ × c × (Tout - Tavg) / 3600{`\n`}
              Годовое потребление = V × ρ × c × ГСОП / 1000
            </span>
            <b>Q</b> — мощность нагревателя (кВт)<br />
            <b>L</b> — расход воздуха (м³/ч)<br />
            <b>ρ</b> — плотность воздуха (1.2 кг/м³)<br />
            <b>c</b> — удельная теплоемкость воздуха (1.005 кДж/(кг·°C))<br />
            <b>Tout</b> — температура на выходе (°C)<br />
            <b>Tavg</b> — средняя температура воздуха (°C)<br />
            <b>ГСОП</b> — градусо-сутки отопительного периода<br />
            <br />
            <b>Примечания:</b>
            <ul style={{margin:0, paddingLeft:20}}>
              <li>При наличии рекуператора мощность снижается на 70%</li>
              <li>Для ночного тарифа применяется коэффициент 0.5 в течение 8 часов</li>
              <li>Расчет газа учитывает КПД котла 90%</li>
              <li>Теплотворная способность газа: 8000 ккал/м³</li>
            </ul>
          </div>
        )}

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

        <VentilationInputs
          airFlow={airFlow}
          setAirFlow={setAirFlow}
          inletTemp={inletTemp}
          setInletTemp={setInletTemp}
          outletTemp={outletTemp}
          setOutletTemp={setOutletTemp}
          heaterType={heaterType}
          setHeaterType={setHeaterType}
          supplyTemp={supplyTemp}
          setSupplyTemp={setSupplyTemp}
          returnTemp={returnTemp}
          setReturnTemp={setReturnTemp}
          electricityPrice={electricityPrice}
          setElectricityPrice={setElectricityPrice}
          gasPrice={gasPrice}
          setGasPrice={setGasPrice}
          hoursPerDay={hoursPerDay}
          setHoursPerDay={setHoursPerDay}
          daysPerMonth={daysPerMonth}
          setDaysPerMonth={setDaysPerMonth}
          isNightTariff={isNightTariff}
          setIsNightTariff={setIsNightTariff}
          hasRecuperator={hasRecuperator}
          setHasRecuperator={setHasRecuperator}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
      </div>
    </div>
  );
};

export default VentilationHeatingCalculator;
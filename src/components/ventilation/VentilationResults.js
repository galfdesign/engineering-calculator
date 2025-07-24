import React from 'react';

const VentilationResults = ({ 
  power, 
  heaterType, 
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
      {/* Верхний блок с годовыми показателями */}
      <div className="results" style={{padding:'18px 0 8px 0'}}>
        {annualEnergy !== undefined && annualEnergy !== null && annualEnergy !== '' && (
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Годовое потребление</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2}}>{annualEnergy} кВт·ч/год</span>
          </div>
        )}
        {electricityCost !== undefined && electricityCost !== null && electricityCost !== '' && (
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Стоимость на электричестве</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2}}>{Math.round(electricityCost)} ₽/год</span>
          </div>
        )}
        {gasCostAnnual !== undefined && gasCostAnnual !== null && gasCostAnnual !== '' && (
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Стоимость на газе</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2}}>{gasCostAnnual} ₽/год</span>
          </div>
        )}
      </div>

      {/* Нижний блок с месячными показателями */}
      <div className="results" style={{padding:'18px 0 8px 0', display: 'none'}}>
        {heaterType === 'water' && (
          <>
            {gasConsumption && (
              <div className="result-item">
                <span className="result-label">Потребление газа</span>
                <span className="result-value">{gasConsumption} м³/мес</span>
              </div>
            )}
            {gasCost && (
              <div className="result-item">
                <span className="result-label">Стоимость газа</span>
                <span className="result-value">{gasCost} ₽/мес</span>
              </div>
            )}
          </>
        )}

        {heaterType === 'electric' && electricityConsumption && (
          <>
            <div className="result-item">
              <span className="result-label">Потребление электроэнергии</span>
              <span className="result-value">{electricityConsumption} кВт·ч/мес</span>
            </div>
            {operatingCost && (
              <div className="result-item">
                <span className="result-label">Стоимость эксплуатации</span>
                <span className="result-value">{operatingCost} ₽/мес</span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default VentilationResults; 
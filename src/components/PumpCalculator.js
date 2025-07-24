import React, { useState } from 'react';
import './PumpCalculator.css';

const PumpCalculator = () => {
  const [formData, setFormData] = useState({
    flowRate: '',
    head: '',
    liquidType: 'water',
    temperature: '',
    viscosity: '',
    density: '',
    systemType: 'closed',
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calculatePump = (e) => {
    e.preventDefault();
    
    // Basic calculations for pump selection
    const { flowRate, head, liquidType, temperature, viscosity, density, systemType } = formData;
    
    // Convert inputs to numbers
    const Q = parseFloat(flowRate); // m³/h
    const H = parseFloat(head); // meters
    const T = parseFloat(temperature); // °C
    const visc = parseFloat(viscosity); // cP
    const dens = parseFloat(density) || 1000; // kg/m³ (default for water)

    // Calculate power requirement (kW)
    const power = (Q * H * dens * 9.81) / (3.6 * 1000 * 0.7); // Assuming 70% efficiency

    // Basic pump selection logic
    let pumpType = '';
    if (Q <= 10 && H <= 20) {
      pumpType = 'Центробежный насос малой мощности';
    } else if (Q <= 50 && H <= 50) {
      pumpType = 'Центробежный насос средней мощности';
    } else if (Q <= 200 && H <= 100) {
      pumpType = 'Многоступенчатый центробежный насос';
    } else {
      pumpType = 'Высоконапорный центробежный насос';
    }

    setResult({
      requiredPower: power.toFixed(2),
      pumpType,
      recommendations: [
        `Рекомендуемая мощность: ${power.toFixed(2)} кВт`,
        `Тип насоса: ${pumpType}`,
        `Учитывайте запас мощности 20-30%`,
        `Рекомендуется установка обратного клапана`,
        systemType === 'open' ? 'Для открытой системы рекомендуется установка воздухоотводчика' : ''
      ].filter(Boolean)
    });
  };

  return (
    <div className="pump-calculator">
      <h2>Калькулятор подбора насоса</h2>
      <form onSubmit={calculatePump}>
        <div className="form-group">
          <label>
            Расход (Q), м³/ч:
            <input
              type="number"
              name="flowRate"
              value={formData.flowRate}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Напор (H), м:
            <input
              type="number"
              name="head"
              value={formData.head}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Тип жидкости:
            <select
              name="liquidType"
              value={formData.liquidType}
              onChange={handleInputChange}
            >
              <option value="water">Вода</option>
              <option value="glycol">Гликоль</option>
              <option value="oil">Масло</option>
              <option value="other">Другое</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Температура, °C:
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              required
              min="-20"
              max="150"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Вязкость, сП:
            <input
              type="number"
              name="viscosity"
              value={formData.viscosity}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Плотность, кг/м³:
            <input
              type="number"
              name="density"
              value={formData.density}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Тип системы:
            <select
              name="systemType"
              value={formData.systemType}
              onChange={handleInputChange}
            >
              <option value="closed">Закрытая</option>
              <option value="open">Открытая</option>
            </select>
          </label>
        </div>

        <button type="submit">Рассчитать</button>
      </form>

      {result && (
        <div className="result-section">
          <h3>Результаты расчета:</h3>
          <div className="result-content">
            <p><strong>Требуемая мощность:</strong> {result.requiredPower} кВт</p>
            <p><strong>Тип насоса:</strong> {result.pumpType}</p>
            <h4>Рекомендации:</h4>
            <ul>
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpCalculator; 
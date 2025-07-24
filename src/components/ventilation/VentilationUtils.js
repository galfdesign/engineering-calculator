// Константы для расчетов
export const AIR_DENSITY = 1.2; // кг/м³
export const SPECIFIC_HEAT = 1.005; // кДж/(кг·°C)
export const GAS_CALORIFIC_VALUE = 8000; // ккал/м³
export const RECUPERATOR_EFFICIENCY = 0.7; // КПД рекуператора
export const NIGHT_TARIFF_DISCOUNT = 0.5; // Скидка на ночной тариф
export const WATER_SPECIFIC_HEAT = 4.19; // кДж/(кг·°C)
export const WATER_DENSITY = 1000; // кг/м³

// Расчет мощности нагревателя
export const calculatePower = (airFlow, regionTemp, outletTemp, hasRecuperator = false) => {
  // airFlow — м³/ч, regionTemp и outletTemp — °C
  // AIR_DENSITY — кг/м³, SPECIFIC_HEAT — кДж/(кг·°C)
  // Q = L * ρ * c * (Tout - Tavg) / 3600 (кВт)
  // Если есть рекуператор, мощность уменьшается
  const L = airFlow; // м³/ч
  const rho = AIR_DENSITY; // кг/м³
  const c = SPECIFIC_HEAT; // кДж/(кг·°C)
  const deltaT = outletTemp - regionTemp; // °C
  let Q = (L * rho * c * deltaT) / 3600; // кВт
  if (hasRecuperator) {
    Q = Q * (1 - RECUPERATOR_EFFICIENCY);
  }
  return Q > 0 ? Q.toFixed(2) : 0;
};

// Расчет расхода воды
export const calculateWaterFlow = (power, supplyTemp, returnTemp) => {
  // power — кВт, supplyTemp и returnTemp — °C
  // G = Q / (c * ρ * Δt) * 3600 (кг/ч)
  const Q = power; // кВт
  const c = WATER_SPECIFIC_HEAT; // кДж/(кг·°C)
  const rho = WATER_DENSITY; // кг/м³
  const deltaT = supplyTemp - returnTemp; // °C
  if (deltaT <= 0) return 0;
  const G = (Q * 3600) / (c * rho * deltaT); // кг/ч
  return G > 0 ? G.toFixed(2) : 0;
};

// Расчет потребления электроэнергии
export const calculateElectricityConsumption = (power, hoursPerDay, daysPerMonth, isNightTariff = false) => {
  // power — кВт, hoursPerDay — ч/день, daysPerMonth — дней/месяц
  // E = P * t * d (кВт·ч/мес)
  const P = power; // кВт
  const t = hoursPerDay; // ч/день
  const d = daysPerMonth; // дней/месяц
  const E = P * t * d; // кВт·ч/мес
  return E > 0 ? E.toFixed(2) : 0;
};

// Расчет потребления газа
export const calculateGasConsumption = (power, hoursPerDay, daysPerMonth) => {
  // power — кВт, hoursPerDay — ч/день, daysPerMonth — дней/месяц
  // V = (Q * t * d) / (η * H) (м³/мес)
  const Q = power; // кВт
  const t = hoursPerDay; // ч/день
  const d = daysPerMonth; // дней/месяц
  const eta = 0.9; // КПД котла
  const H = GAS_CALORIFIC_VALUE / 860; // кВт·ч/м³ (перевод из ккал/m³)
  const V = (Q * t * d) / (eta * H); // м³/мес
  return V > 0 ? V.toFixed(2) : 0;
};

// Расчет стоимости эксплуатации
export const calculateOperatingCost = (consumption, pricePerKWh, isNightTariff = false) => {
  // consumption — кВт·ч/мес, pricePerKWh — ₽/кВт·ч
  // C = E * p (₽/мес)
  const E = consumption; // кВт·ч/мес
  const p = isNightTariff ? pricePerKWh * NIGHT_TARIFF_DISCOUNT : pricePerKWh; // ₽/кВт·ч
  const C = E * p; // ₽/мес
  return C > 0 ? C.toFixed(2) : 0;
};

// Расчет стоимости газа
export const calculateGasCost = (gasConsumption, gasPrice) => {
  // gasConsumption — м³/мес, gasPrice — ₽/1000 м³
  // C = V * p (₽/мес)
  const V = gasConsumption; // м³/мес
  const p = gasPrice / 1000; // ₽/м³
  const C = V * p; // ₽/мес
  return C > 0 ? C.toFixed(2) : 0;
}; 
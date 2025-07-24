import React, { useState, useEffect } from 'react';
import './FlowCalculator.css';

// Данные о мощности радиаторов (Вт) для 75/65/20°C
const radiatorDB = {
  '300': {
    '10': { '400': 144, '500': 180, '600': 439, '700': 513, '800': 586, '900': 659, '1000': 732, '1100': 806, '1200': 879, '1300': 952, '1400': 1025, '1600': 1172, '1800': 1318, '2000': 1465, '2300': 1684, '2600': 1904, '3000': 2197 },
    '11': { '400': 239, '500': 299, '600': 647, '700': 755, '800': 862, '900': 970, '1000': 1078, '1100': 1186, '1200': 1294, '1300': 1401, '1400': 1509, '1600': 1725, '1800': 1940, '2000': 2156, '2300': 2479, '2600': 2803, '3000': 3234 },
    '22': { '400': 409, '500': 511, '600': 613, '700': 715, '800': 818, '900': 920, '1000': 1022, '1100': 1124, '1200': 1226, '1300': 1329, '1400': 1431, '1600': 1635, '1800': 1840, '2000': 2044, '2300': 2351, '2600': 2657, '3000': 3066 },
    '33': { '400': 584, '500': 731, '600': 877, '700': 1023, '800': 1169, '900': 1315, '1000': 1461, '1100': 1607, '1200': 1753, '1300': 1899, '1400': 2045, '1600': 2338, '1800': 2630, '2000': 2922, '2300': 3360, '2600': 3799, '3000': 4383 }
  },
  '400': {
    '10': { '400': 183, '500': 229, '600': 274, '700': 320, '800': 366, '900': 411, '1000': 457, '1100': 503, '1200': 548, '1300': 594, '1400': 640, '1600': 731, '1800': 823, '2000': 914, '2300': 1051, '2600': 1188, '3000': 1371 },
    '11': { '400': 304, '500': 380, '600': 456, '700': 532, '800': 608, '900': 684, '1000': 760, '1100': 836, '1200': 912, '1300': 988, '1400': 1064, '1600': 1216, '1800': 1368, '2000': 1520, '2300': 1748, '2600': 1976, '3000': 2280 },
    '22': { '400': 513, '500': 642, '600': 770, '700': 898, '800': 1026, '900': 1155, '1000': 1283, '1100': 1411, '1200': 1540, '1300': 1668, '1400': 1796, '1600': 2053, '1800': 2309, '2000': 2566, '2300': 2951, '2600': 3336, '3000': 3849 },
    '33': { '400': 735, '500': 919, '600': 1102, '700': 1286, '800': 1470, '900': 1653, '1000': 1837, '1100': 2021, '1200': 2204, '1300': 2388, '1400': 2572, '1600': 2939, '1800': 3307, '2000': 3674, '2300': 4225, '2600': 4776, '3000': 5511 }
  },
  '500': {
    '10': { '400': 223, '500': 279, '600': 334, '700': 390, '800': 446, '900': 501, '1000': 557, '1100': 613, '1200': 668, '1300': 724, '1400': 780, '1600': 891, '1800': 1003, '2000': 1114, '2300': 1281, '2600': 1448, '3000': 1671 },
    '11': { '400': 367, '500': 459, '600': 551, '700': 643, '800': 734, '900': 826, '1000': 918, '1100': 1010, '1200': 1102, '1300': 1193, '1400': 1285, '1600': 1469, '1800': 1652, '2000': 1836, '2300': 2111, '2600': 2387, '3000': 2754 },
    '22': { '400': 616, '500': 770, '600': 924, '700': 1078, '800': 1232, '900': 1386, '1000': 1540, '1100': 1694, '1200': 1848, '1300': 2002, '1400': 2156, '1600': 2464, '1800': 2772, '2000': 3080, '2300': 3542, '2600': 4004, '3000': 4620 },
    '33': { '400': 879, '500': 1099, '600': 1318, '700': 1538, '800': 1758, '900': 1977, '1000': 2197, '1100': 2417, '1200': 2636, '1300': 2856, '1400': 3076, '1600': 3515, '1800': 3955, '2000': 4394, '2300': 5053, '2600': 5712, '3000': 6591 }
  },
  '600': {
    '10': { '400': 263, '500': 329, '600': 395, '700': 461, '800': 526, '900': 592, '1000': 658, '1100': 724, '1200': 790, '1300': 855, '1400': 921, '1600': 1053, '1800': 1184, '2000': 1316, '2300': 1513, '2600': 1711, '3000': 1974 },
    '11': { '400': 430, '500': 538, '600': 646, '700': 753, '800': 861, '900': 968, '1000': 1076, '1100': 1184, '1200': 1291, '1300': 1399, '1400': 1506, '1600': 1722, '1800': 1937, '2000': 2152, '2300': 2475, '2600': 2798, '3000': 3228 },
    '22': { '400': 716, '500': 896, '600': 1075, '700': 1254, '800': 1433, '900': 1612, '1000': 1791, '1100': 1970, '1200': 2149, '1300': 2328, '1400': 2507, '1600': 2866, '1800': 3224, '2000': 3582, '2300': 4119, '2600': 4657, '3000': 5373 },
    '33': { '400': 1017, '500': 1271, '600': 1525, '700': 1779, '800': 2034, '900': 2288, '1000': 2542, '1100': 2796, '1200': 3050, '1300': 3305, '1400': 3559, '1600': 4067, '1800': 4576, '2000': 5084, '2300': 5847, '2600': 6609, '3000': 7626 }
  }
};

const typeNames = {
  '10': 'Тип 10 (1 панель)',
  '11': 'Тип 11 (1 панель + 1 конвектор)',
  '22': 'Тип 22 (2 панели + 2 конвектора)',
  '33': 'Тип 33 (3 панели + 3 конвектора)'
};

function calculateTempFactor(flowTemp, returnTemp, roomTemp) {
  const deltaT1 = flowTemp - roomTemp;
  const deltaT2 = returnTemp - roomTemp;
  if (deltaT1 <= 0 || deltaT2 <= 0) return 0;
  const deltaT = (deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2);
  const standardDeltaT = (75 - 65) / Math.log((75 - 20) / (65 - 20));
  const n = 1.3;
  return Math.pow(deltaT / standardDeltaT, n);
}

const heights = ['300', '400', '500'];
const flowTemps = [50, 55, 60, 65, 70, 75, 80, 85, 90];
const returnTemps = [40, 45, 50, 55, 60, 65, 70];
const roomTemps = [18, 20, 22, 24];

// Данные для секционных алюминиевых радиаторов (Δt50, 80/60/20)
const aluminumSectionalDB = {
  '350': 83,   // Вт/секция
  '500': 115,  // Вт/секция
};
// Поправочные коэффициенты для секционных радиаторов (Royal Thermo BiLiner, стр. 6)
const aluminumCorrectionTable = {
  '105-100': { '5': 1.54, '8': 1.48, '12': 1.40, '16': 1.32, '18': 1.28, '20': 1.24, '22': 1.20, '24': 1.16 },
  '105-90':  { '5': 1.44, '8': 1.38, '12': 1.30, '16': 1.22, '18': 1.18, '20': 1.14, '22': 1.10, '24': 1.07 },
  '105-80':  { '5': 1.34, '8': 1.28, '12': 1.20, '16': 1.12, '18': 1.08, '20': 1.05, '22': 1.01, '24': 0.97 },

  '100-90':  { '5': 1.39, '8': 1.33, '12': 1.25, '16': 1.17, '18': 1.13, '20': 1.09, '22': 1.06, '24': 1.02 },
  '100-80':  { '5': 1.29, '8': 1.23, '12': 1.15, '16': 1.07, '18': 1.04, '20': 1.00, '22': 0.96, '24': 0.93 },
  '100-70':  { '5': 1.19, '8': 1.13, '12': 1.06, '16': 0.98, '18': 0.94, '20': 0.91, '22': 0.87, '24': 0.84 },

  '95-90':   { '5': 1.34, '8': 1.28, '12': 1.20, '16': 1.12, '18': 1.08, '20': 1.05, '22': 1.01, '24': 0.97 },
  '95-80':   { '5': 1.24, '8': 1.18, '12': 1.10, '16': 1.03, '18': 0.99, '20': 0.95, '22': 0.92, '24': 0.88 },
  '95-70':   { '5': 1.14, '8': 1.08, '12': 1.01, '16': 0.94, '18': 0.90, '20': 0.86, '22': 0.83, '24': 0.79 },

  '90-80':   { '5': 1.19, '8': 1.13, '12': 1.06, '16': 0.98, '18': 0.94, '20': 0.91, '22': 0.87, '24': 0.84 },
  '90-70':   { '5': 1.09, '8': 1.04, '12': 0.96, '16': 0.89, '18': 0.85, '20': 0.82, '22': 0.78, '24': 0.75 },

  '85-80':   { '5': 1.14, '8': 1.08, '12': 1.01, '16': 0.94, '18': 0.90, '20': 0.86, '22': 0.83, '24': 0.79 },
  '85-70':   { '5': 1.05, '8': 0.99, '12': 0.92, '16': 0.85, '18': 0.81, '20': 0.77, '22': 0.74, '24': 0.71 },
  '85-60':   { '5': 0.95, '8': 0.90, '12': 0.83, '16': 0.76, '18': 0.72, '20': 0.69, '22': 0.65, '24': 0.62 },

  '80-70':   { '5': 1.00, '8': 0.94, '12': 0.87, '16': 0.80, '18': 0.77, '20': 0.73, '22': 0.70, '24': 0.66 },
  '80-60':   { '5': 0.91, '8': 0.85, '12': 0.78, '16': 0.71, '18': 0.68, '20': 0.65, '22': 0.61, '24': 0.58 },

  '75-70':   { '5': 0.95, '8': 0.90, '12': 0.83, '16': 0.76, '18': 0.72, '20': 0.69, '22': 0.65, '24': 0.62 },
  '75-60':   { '5': 0.86, '8': 0.81, '12': 0.74, '16': 0.67, '18': 0.64, '20': 0.60, '22': 0.57, '24': 0.54 },
  '75-50':   { '5': 0.77, '8': 0.72, '12': 0.65, '16': 0.59, '18': 0.55, '20': 0.52, '22': 0.49, '24': 0.46 },

  '70-60':   { '5': 0.82, '8': 0.77, '12': 0.70, '16': 0.63, '18': 0.60, '20': 0.56, '22': 0.53, '24': 0.50 },
  '70-50':   { '5': 0.73, '8': 0.68, '12': 0.61, '16': 0.55, '18': 0.51, '20': 0.48, '22': 0.45, '24': 0.42 },

  '65-60':   { '5': 0.77, '8': 0.72, '12': 0.65, '16': 0.59, '18': 0.55, '20': 0.52, '22': 0.49, '24': 0.46 },
  '65-50':   { '5': 0.69, '8': 0.64, '12': 0.57, '16': 0.51, '18': 0.48, '20': 0.44, '22': 0.41, '24': 0.38 },

  '60-50':   { '5': 0.65, '8': 0.60, '12': 0.53, '16': 0.47, '18': 0.44, '20': 0.41, '22': 0.38, '24': 0.35 },
  '60-40':   { '5': 0.60, '8': 0.55, '12': 0.49, '16': 0.43, '18': 0.40, '20': 0.37, '22': 0.34, '24': 0.31 },

  '55-50':   { '5': 0.60, '8': 0.55, '12': 0.49, '16': 0.43, '18': 0.40, '20': 0.37, '22': 0.34, '24': 0.31 },
  '55-40':   { '5': 0.52, '8': 0.48, '12': 0.41, '16': 0.35, '18': 0.33, '20': 0.30, '22': 0.27, '24': 0.24 },

  '50-40':   { '5': 0.48, '8': 0.44, '12': 0.38, '16': 0.32, '18': 0.29, '20': 0.26, '22': 0.24, '24': 0.21 },

  '45-40':   { '5': 0.44, '8': 0.40, '12': 0.34, '16': 0.28, '18': 0.26, '20': 0.23, '22': 0.20, '24': 0.18 },

  '40-30':   { '5': 0.33, '8': 0.29, '12': 0.24, '16': 0.18, '18': 0.16, '20': 0.13, '22': 0.11, '24': 0.09 }
};

function getAluminumCorrection(tp, to, tv) {
  // Округляем температуры до ближайших значений из таблицы
  const roundedTp = Math.round(tp / 5) * 5;
  const roundedTo = Math.round(to / 5) * 5;
  const roundedTv = Math.round(tv / 5) * 5;
  
  // Формируем ключ для поиска в таблице
  const key = `${roundedTp}-${roundedTo}`;
  const row = aluminumCorrectionTable[key];
  
  if (!row) {
    // Если точного совпадения нет, используем ближайшие значения
    const availableKeys = Object.keys(aluminumCorrectionTable);
    const closestKey = availableKeys.reduce((closest, current) => {
      const [currentTp, currentTo] = current.split('-').map(Number);
      const currentDiff = Math.abs(currentTp - roundedTp) + Math.abs(currentTo - roundedTo);
      const closestDiff = Math.abs(closest.split('-')[0] - roundedTp) + Math.abs(closest.split('-')[1] - roundedTo);
      return currentDiff < closestDiff ? current : closest;
    });
    return aluminumCorrectionTable[closestKey][String(roundedTv)] || 1.00;
  }
  
  return row[String(roundedTv)] || 1.00;
}

// Данные для трубчатых радиаторов (колонки, высота, мощность при Δt70)
const tubeData = [
  { code: 'TUB 2037', cols: 2, height: 37, power: 47, heightMM: 365, depthMM: 66, centerDistanceMM: 300, heat70: 47, mass: 0.7, volume: 0.18 },
  { code: 'TUB 3037', cols: 3, height: 37, power: 65, heightMM: 365, depthMM: 107, centerDistanceMM: 300, heat70: 65, mass: 1.1, volume: 0.27 },
  { code: 'TUB 2042', cols: 2, height: 42, power: 52, heightMM: 415, depthMM: 66, centerDistanceMM: 350, heat70: 52, mass: 0.8, volume: 0.20 },
  { code: 'TUB 3042', cols: 3, height: 42, power: 76, heightMM: 415, depthMM: 107, centerDistanceMM: 350, heat70: 76, mass: 1.2, volume: 0.30 },
  { code: 'TUB 2047', cols: 2, height: 47, power: 57, heightMM: 465, depthMM: 66, centerDistanceMM: 400, heat70: 57, mass: 0.9, volume: 0.22 },
  { code: 'TUB 3047', cols: 3, height: 47, power: 85, heightMM: 465, depthMM: 107, centerDistanceMM: 400, heat70: 85, mass: 1.3, volume: 0.33 },
  { code: 'TUB 2052', cols: 2, height: 52, power: 62, heightMM: 515, depthMM: 66, centerDistanceMM: 450, heat70: 62, mass: 1.0, volume: 0.24 },
  { code: 'TUB 3052', cols: 3, height: 52, power: 95, heightMM: 515, depthMM: 107, centerDistanceMM: 450, heat70: 95, mass: 1.4, volume: 0.36 },
  { code: 'TUB 2057', cols: 2, height: 57, power: 68, heightMM: 565, depthMM: 66, centerDistanceMM: 500, heat70: 68, mass: 1.1, volume: 0.26 },
  { code: 'TUB 3057', cols: 3, height: 57, power: 103, heightMM: 565, depthMM: 107, centerDistanceMM: 500, heat70: 103, mass: 1.5, volume: 0.39 },
  { code: 'TUB 2062', cols: 2, height: 62, power: 74, heightMM: 615, depthMM: 66, centerDistanceMM: 550, heat70: 74, mass: 1.2, volume: 0.28 },
  { code: 'TUB 3062', cols: 3, height: 62, power: 112, heightMM: 615, depthMM: 107, centerDistanceMM: 550, heat70: 112, mass: 1.6, volume: 0.42 },
  { code: 'TUB 2067', cols: 2, height: 67, power: 79, heightMM: 665, depthMM: 66, centerDistanceMM: 600, heat70: 79, mass: 1.3, volume: 0.30 },
  { code: 'TUB 3067', cols: 3, height: 67, power: 120, heightMM: 665, depthMM: 107, centerDistanceMM: 600, heat70: 120, mass: 1.7, volume: 0.45 },
  { code: 'TUB 2072', cols: 2, height: 72, power: 84, heightMM: 715, depthMM: 66, centerDistanceMM: 650, heat70: 84, mass: 1.4, volume: 0.32 },
  { code: 'TUB 3072', cols: 3, height: 72, power: 129, heightMM: 715, depthMM: 107, centerDistanceMM: 650, heat70: 129, mass: 1.8, volume: 0.48 },
  { code: 'TUB 2077', cols: 2, height: 77, power: 90, heightMM: 765, depthMM: 66, centerDistanceMM: 700, heat70: 90, mass: 1.5, volume: 0.34 },
  { code: 'TUB 3077', cols: 3, height: 77, power: 138, heightMM: 765, depthMM: 107, centerDistanceMM: 700, heat70: 138, mass: 1.9, volume: 0.51 },
  { code: 'TUB 2082', cols: 2, height: 82, power: 95, heightMM: 815, depthMM: 66, centerDistanceMM: 750, heat70: 95, mass: 1.6, volume: 0.36 },
  { code: 'TUB 3082', cols: 3, height: 82, power: 147, heightMM: 815, depthMM: 107, centerDistanceMM: 750, heat70: 147, mass: 2.0, volume: 0.54 },
  { code: 'TUB 2087', cols: 2, height: 87, power: 101, heightMM: 865, depthMM: 66, centerDistanceMM: 800, heat70: 101, mass: 1.7, volume: 0.38 },
  { code: 'TUB 3087', cols: 3, height: 87, power: 154, heightMM: 865, depthMM: 107, centerDistanceMM: 800, heat70: 154, mass: 2.1, volume: 0.57 },
  { code: 'TUB 2092', cols: 2, height: 92, power: 106, heightMM: 915, depthMM: 66, centerDistanceMM: 850, heat70: 106, mass: 1.8, volume: 0.40 },
  { code: 'TUB 3092', cols: 3, height: 92, power: 163, heightMM: 915, depthMM: 107, centerDistanceMM: 850, heat70: 163, mass: 2.2, volume: 0.60 },
  { code: 'TUB 2097', cols: 2, height: 97, power: 110, heightMM: 965, depthMM: 66, centerDistanceMM: 900, heat70: 110, mass: 1.9, volume: 0.42 },
  { code: 'TUB 3097', cols: 3, height: 97, power: 173, heightMM: 965, depthMM: 107, centerDistanceMM: 900, heat70: 173, mass: 2.3, volume: 0.63 },
  { code: 'TUB 2100', cols: 2, height: 100, power: 114, heightMM: 1000, depthMM: 66, centerDistanceMM: 935, heat70: 114, mass: 2.0, volume: 0.44 },
  { code: 'TUB 3100', cols: 3, height: 100, power: 178, heightMM: 1000, depthMM: 107, centerDistanceMM: 935, heat70: 178, mass: 2.4, volume: 0.66 },
  { code: 'TUB 2110', cols: 2, height: 110, power: 124, heightMM: 1100, depthMM: 66, centerDistanceMM: 1035, heat70: 124, mass: 2.2, volume: 0.48 },
  { code: 'TUB 3110', cols: 3, height: 110, power: 196, heightMM: 1100, depthMM: 107, centerDistanceMM: 1035, heat70: 196, mass: 2.6, volume: 0.72 },
  { code: 'TUB 2120', cols: 2, height: 120, power: 134, heightMM: 1200, depthMM: 66, centerDistanceMM: 1135, heat70: 134, mass: 2.4, volume: 0.52 },
  { code: 'TUB 3120', cols: 3, height: 120, power: 216, heightMM: 1200, depthMM: 107, centerDistanceMM: 1135, heat70: 216, mass: 2.8, volume: 0.78 },
  { code: 'TUB 2150', cols: 2, height: 150, power: 167, heightMM: 1500, depthMM: 66, centerDistanceMM: 1435, heat70: 167, mass: 3.0, volume: 0.90 },
  { code: 'TUB 3150', cols: 3, height: 150, power: 267, heightMM: 1500, depthMM: 107, centerDistanceMM: 1435, heat70: 267, mass: 3.6, volume: 1.08 },
  { code: 'TUB 2180', cols: 2, height: 180, power: 198, heightMM: 1800, depthMM: 66, centerDistanceMM: 1735, heat70: 198, mass: 3.6, volume: 1.08 },
  { code: 'TUB 3180', cols: 3, height: 180, power: 320, heightMM: 1800, depthMM: 107, centerDistanceMM: 1735, heat70: 320, mass: 4.2, volume: 1.26 },
  { code: 'TUB 2200', cols: 2, height: 200, power: 216, heightMM: 2000, depthMM: 66, centerDistanceMM: 1935, heat70: 216, mass: 4.0, volume: 1.20 },
  { code: 'TUB 3200', cols: 3, height: 200, power: 330, heightMM: 2000, depthMM: 107, centerDistanceMM: 1935, heat70: 330, mass: 4.6, volume: 1.38 },
  { code: 'TUB 2220', cols: 2, height: 220, power: 241, heightMM: 2200, depthMM: 66, centerDistanceMM: 2135, heat70: 241, mass: 4.4, volume: 1.32 },
  { code: 'TUB 3220', cols: 3, height: 220, power: 339, heightMM: 2200, depthMM: 107, centerDistanceMM: 2135, heat70: 339, mass: 5.0, volume: 1.50 },
  { code: 'TUB 2240', cols: 2, height: 240, power: 262, heightMM: 2400, depthMM: 66, centerDistanceMM: 2335, heat70: 262, mass: 4.8, volume: 1.44 },
  { code: 'TUB 3240', cols: 3, height: 240, power: 347, heightMM: 2400, depthMM: 107, centerDistanceMM: 2335, heat70: 347, mass: 5.2, volume: 1.56 },
];

const RadiatorCalculator = ({ onBack }) => {
  const [type, setType] = useState('22');
  const [height, setHeight] = useState('500');
  const [length, setLength] = useState('1000');
  const [flowTemp, setFlowTemp] = useState(70);
  const [returnTemp, setReturnTemp] = useState(60);
  const [roomTemp, setRoomTemp] = useState(20);
  const [tooltip, setTooltip] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('panel'); // 'panel', 'section', 'tube'
  const [sectionResult, setSectionResult] = useState(null);
  const [sectionHeight, setSectionHeight] = useState('350');
  const [sectionCount, setSectionCount] = useState(10);
  const [sectionTp, setSectionTp] = useState(70);
  const [sectionTo, setSectionTo] = useState(60);
  const [sectionTv, setSectionTv] = useState(20);
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const [sectionSpoilerOpen, setSectionSpoilerOpen] = useState(false);
  const [analogsOpen, setAnalogsOpen] = useState(false);
  const [sectionAnalogsOpen, setSectionAnalogsOpen] = useState(false);
  const [tubeCols, setTubeCols] = useState(2);
  const [tubeHeight, setTubeHeight] = useState(37);
  const [tubeCount, setTubeCount] = useState(10);
  const [tubeFlowTemp, setTubeFlowTemp] = useState(70);
  const [tubeReturnTemp, setTubeReturnTemp] = useState(60);
  const [tubeRoomTemp, setTubeRoomTemp] = useState(20);
  const [tubeResult, setTubeResult] = useState(null);
  const [tubeSpoilerOpen, setTubeSpoilerOpen] = useState(false);
  const [tubeAnalogsOpen, setTubeAnalogsOpen] = useState(false);
  const [tubePanelOpen, setTubePanelOpen] = useState(true);
  const [tubeSectionOpen, setTubeSectionOpen] = useState(false);
  const [tubeTubeOpen, setTubeTubeOpen] = useState(false);
  const [panelPanelOpen, setPanelPanelOpen] = useState(true);
  const [panelSectionOpen, setPanelSectionOpen] = useState(false);
  const [panelTubeOpen, setPanelTubeOpen] = useState(false);
  const [sectionPanelOpen, setSectionPanelOpen] = useState(true);
  const [sectionSectionOpen, setSectionSectionOpen] = useState(false);
  const [sectionTubeOpen, setSectionTubeOpen] = useState(false);
  // Состояние для переключателя аналогов
  const [panelAnalogsTab, setPanelAnalogsTab] = useState('panel');
  const [sectionAnalogsTab, setSectionAnalogsTab] = useState('panel');
  const [tubeAnalogsTab, setTubeAnalogsTab] = useState('panel');

  // Обновление длины при смене типа/высоты
  useEffect(() => {
    if (!type || !height) return;
    const lengths = Object.keys(radiatorDB[height][type]).sort((a, b) => a - b);
    if (!lengths.includes(length)) {
      setLength(lengths[0]);
    }
  }, [type, height]);

  // Автоматический расчет
  useEffect(() => {
    if (!type || !height || !length) {
      setResult(null);
      return;
    }
    if (parseInt(flowTemp) <= parseInt(returnTemp)) {
      setResult({
        error: true,
        type,
        height,
        length,
        flowTemp,
        returnTemp,
        roomTemp
      });
      return;
    }
    const basePower = radiatorDB[height][type][length];
    const tempFactor = calculateTempFactor(Number(flowTemp), Number(returnTemp), Number(roomTemp));
    const actualPower = Math.round(basePower * tempFactor);
    setResult({
      actualPower,
      basePower,
      tempFactor,
      type,
      height,
      length,
      flowTemp,
      returnTemp,
      roomTemp
    });
  }, [type, height, length, flowTemp, returnTemp, roomTemp]);

  // Автоматический расчет для секционного радиатора
  useEffect(() => {
    if (!sectionHeight || !sectionCount || !sectionTp || !sectionTo || !sectionTv) {
      setSectionResult(null);
      return;
    }
    // Для 500 мм всегда использовать 180 Вт/секция, для 350 мм — 122 Вт/секция
    const basePower = sectionHeight === '500' ? 180 : sectionHeight === '350' ? 122 : aluminumSectionalDB[sectionHeight];
    
    if (parseInt(sectionTp) <= parseInt(sectionTo)) {
      setSectionResult({
        error: true,
        height: sectionHeight,
        sections: sectionCount,
        tp: sectionTp,
        to: sectionTo,
        tv: sectionTv,
        basePower,
        k: 0
      });
      return;
    }

    const k = getAluminumCorrection(Number(sectionTp), Number(sectionTo), Number(sectionTv));
    const power = Math.round(Number(sectionCount) * basePower * k);

    setSectionResult({
      power,
      height: sectionHeight,
      sections: sectionCount,
      tp: sectionTp,
      to: sectionTo,
      tv: sectionTv,
      basePower,
      k
    });
  }, [sectionHeight, sectionCount, sectionTp, sectionTo, sectionTv]);

  // Функция для расчёта логарифмического Δt
  function calcLogDeltaT(tp, to, tv) {
    const d1 = tp - tv;
    const d2 = to - tv;
    if (d1 <= 0 || d2 <= 0) return 0;
    return (d1 - d2) / Math.log(d1 / d2);
  }

  // Автоматический расчет для трубчатого радиатора с пересчётом по температурному графику
  useEffect(() => {
    const found = tubeData.find(t => t.cols === tubeCols && t.height === tubeHeight);
    if (found && tubeCount > 0) {
      if (parseInt(tubeFlowTemp) <= parseInt(tubeReturnTemp)) {
        setTubeResult({
          error: true,
          cols: tubeCols,
          height: tubeHeight,
          count: tubeCount,
          flowTemp: tubeFlowTemp,
          returnTemp: tubeReturnTemp,
          roomTemp: tubeRoomTemp,
          heightMM: found.heightMM,
          centerDistanceMM: found.centerDistanceMM,
          depthMM: found.depthMM,
          heat70: found.heat70,
          mass: found.mass,
          volume: found.volume
        });
        return;
      }
      const n = 1.25;
      // Логарифмический Δt для текущего режима
      const deltaT = calcLogDeltaT(Number(tubeFlowTemp), Number(tubeReturnTemp), Number(tubeRoomTemp));
      // Базовый режим Δtₙ = 50 (если tubeData указаны для Δt = 50)
      const deltaTn = 70;
      let k = deltaT > 0 ? Math.pow(deltaT / deltaTn, n) : 0;
      if (Math.abs(deltaT - deltaTn) < 0.5) k = 1;
      const power = Math.round(found.power * tubeCount * k);
      setTubeResult({
        power,
        basePower: found.power,
        cols: tubeCols,
        height: tubeHeight,
        count: tubeCount,
        k: k.toFixed(3),
        flowTemp: tubeFlowTemp,
        returnTemp: tubeReturnTemp,
        roomTemp: tubeRoomTemp,
        deltaT: deltaT.toFixed(2),
        deltaTn: deltaTn.toFixed(2),
        heightMM: found.heightMM,
        centerDistanceMM: found.centerDistanceMM,
        depthMM: found.depthMM,
        heat70: found.heat70,
        mass: found.mass,
        volume: found.volume
      });
    } else {
      setTubeResult(null);
    }
  }, [tubeCols, tubeHeight, tubeCount, tubeFlowTemp, tubeReturnTemp, tubeRoomTemp]);

  // Получить доступные длины для выбранных типа и высоты
  const getLengths = () => {
    if (!type || !height) return [];
    return Object.keys(radiatorDB[height][type]).sort((a, b) => a - b);
  };

  // Поиск аналогов для панели (панельные по типу и высоте + секционные)
  function getPanelAnalogs(power, type, height, length, tp, to, tv) {
    const panelAnalogs = [];
    // Для каждого типа и высоты — ближайший панельный
    for (const h of heights) {
      for (const t of Object.keys(typeNames)) {
        let closest = null;
        let minDiff = Infinity;
        for (const l of Object.keys(radiatorDB[h][t])) {
          const p = radiatorDB[h][t][l];
          const diff = Math.abs(p - power);
          if (diff < minDiff) {
            minDiff = diff;
            closest = { kind: 'panel', type: t, height: h, length: l, power: p };
          }
        }
        if (closest) panelAnalogs.push(closest);
      }
    }
    // Секционные (350 и 500 мм, по одному ближайшему для каждой высоты)
    let closest350 = null, closest500 = null, minDiff350 = Infinity, minDiff500 = Infinity;
    for (const sh of Object.keys(aluminumSectionalDB)) {
      const base = sh === '500' ? 180 : sh === '350' ? 122 : aluminumSectionalDB[sh];
      const k = getAluminumCorrection(tp, to, tv);
      for (let n = 1; n <= 30; n++) {
        const p = Math.round(n * base * k);
        const diff = Math.abs(p - power);
        if (sh === '350' && diff < minDiff350) {
          minDiff350 = diff;
          closest350 = { kind: 'section', height: sh, sections: n, power: p, k: k };
        }
        if (sh === '500' && diff < minDiff500) {
          minDiff500 = diff;
          closest500 = { kind: 'section', height: sh, sections: n, power: p, k: k };
        }
      }
    }
    const sectionAnalogs = [];
    if (closest350) sectionAnalogs.push(closest350);
    if (closest500) sectionAnalogs.push(closest500);
    return { panelAnalogs, sectionAnalogs };
  }

  // Поиск аналогов для секционного: ближайший панельный для каждого типа и высоты
  function getSectionAnalogs(power) {
    const panelAnalogs = [];
    for (const h of heights) {
      for (const t of Object.keys(typeNames)) {
        let closest = null;
        let minDiff = Infinity;
        for (const l of Object.keys(radiatorDB[h][t])) {
          const p = radiatorDB[h][t][l];
          const diff = Math.abs(p - power);
          if (diff < minDiff) {
            minDiff = diff;
            closest = { type: t, height: h, length: l, power: p };
          }
        }
        if (closest) panelAnalogs.push(closest);
      }
    }
    return panelAnalogs;
  }

  // Добавим адаптивные стили для кнопок спойлеров
  const spoilerBtnStyle = {
    borderRadius: '10px',
    background: 'var(--main-blue)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(76,201,240,0.13)',
    padding: '10px 24px',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'background 0.2s, transform 0.2s',
    outline: 'none',
    justifyContent: 'center',
    maxWidth: '48%',
  };

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
          <div className="card-title">Калькулятор мощности<br/>радиатора</div>
        </div>
        {activeTab === 'panel' && (
          <>
            <div className="results-block">
              {result && (
                <>
                  <div className="result-row">
                    <span className="result-label">Тепловая мощность</span>
                    {result.error ? (
                      <span className="result-value" style={{color: '#ff4d4f'}}>Ошибка температур</span>
                    ) : (
                      <span className="result-value">{result.actualPower} Вт</span>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 8,
                      justifyContent: 'space-between',
                      width: '100%',
                      marginBottom: window.innerWidth <= 480 ? 8 : 20
                    }}
                  >
                    <button
                      className={`spoiler-btn${spoilerOpen ? ' active' : ''}`}
                      style={{
                        ...spoilerBtnStyle,
                        ...(window.innerWidth <= 480 ? { padding: '8px 8px', fontSize: 14, gap: 6 } : {})
                      }}
                      onClick={() => setSpoilerOpen(v => !v)}
                      aria-expanded={spoilerOpen}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Подробнее
                      <svg style={{transform: spoilerOpen ? 'rotate(90deg) scale(1.15)' : 'rotate(0deg) scale(1)', transition: 'transform 0.2s'}} width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 4L12 9L6 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button
                      className={`spoiler-btn${analogsOpen ? ' active' : ''}`}
                      style={{
                        ...spoilerBtnStyle,
                        ...(window.innerWidth <= 480 ? { padding: '8px 8px', fontSize: 14, gap: 6 } : {})
                      }}
                      onClick={() => setAnalogsOpen(v => !v)}
                      aria-expanded={analogsOpen}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Аналоги
                      <svg style={{transform: analogsOpen ? 'rotate(90deg) scale(1.15)' : 'rotate(0deg) scale(1)', transition: 'transform 0.2s'}} width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 4L12 9L6 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                  {spoilerOpen && (
                    <div style={{paddingTop: '12px'}}>
                      <div className="result-row">
                        <span className="result-label">Модель радиатора</span>
                        <span className="result-value">{typeNames[result.type]}</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Размеры</span>
                        <span className="result-value">{result.length} × {result.height} мм</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура подачи</span>
                        <span className="result-value">{result.flowTemp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура обратки</span>
                        <span className="result-value">{result.returnTemp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура воздуха</span>
                        <span className="result-value">{result.roomTemp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Мощность (75/65/20°C)</span>
                        <span className="result-value">{result.basePower} Вт</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Поправочный коэффициент</span>
                        <span className="result-value">{result.tempFactor.toFixed(3)}</span>
                      </div>
                    </div>
                  )}
                  {analogsOpen && (
                    <div style={{paddingTop: '12px'}}>
                      {result && (() => {
                        const power = result.actualPower;
                        const minPower = power * 0.9;
                        const maxPower = power * 1.1;
                        // Панельные аналоги
                        const panelAnalogs = [];
                        for (const h of heights) {
                          for (const t of Object.keys(typeNames)) {
                            for (const l of Object.keys(radiatorDB[h][t])) {
                              const p = radiatorDB[h][t][l];
                              if (p >= minPower && p <= maxPower) {
                                if (!(t === result.type && h === result.height && l === result.length)) {
                                  panelAnalogs.push({ type: t, height: h, length: l, power: p });
                                }
                              }
                            }
                          }
                        }
                        // Секционные аналоги
                        const sectionAnalogs = [];
                        for (const sh of Object.keys(aluminumSectionalDB)) {
                          const base = sh === '500' ? 180 : sh === '350' ? 122 : aluminumSectionalDB[sh];
                          for (let n = 1; n <= 30; n++) {
                            const k = getAluminumCorrection(result.flowTemp, result.returnTemp, result.roomTemp);
                            const p = Math.round(n * base * k);
                            if (p >= minPower && p <= maxPower) {
                              sectionAnalogs.push({ height: sh, sections: n, power: p, k });
                            }
                          }
                        }
                        // Трубчатые аналоги
                        const tubeAnalogs = [];
                        for (const t of tubeData) {
                          const n = 1.25;
                          const deltaT = calcLogDeltaT(Number(result.flowTemp), Number(result.returnTemp), Number(result.roomTemp));
                          const deltaTn = 70;
                          let k = deltaT > 0 ? Math.pow(deltaT / deltaTn, n) : 0;
                          if (Math.abs(deltaT - deltaTn) < 0.5) k = 1;
                          for (let count = 1; count <= 50; count++) {
                            const p = Math.round(t.power * count * k);
                            if (p >= minPower && p <= maxPower) {
                              tubeAnalogs.push({ cols: t.cols, height: t.height, count, power: p });
                            }
                          }
                        }
                        return <>
                          <div className="analogs-toggle-row" style={{display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'center',gap:32,marginBottom:8}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Панельные</span>
                              <button className={`toggle-option${panelAnalogsTab==='panel'?' active':''}`} onClick={()=>setPanelAnalogsTab('panel')} style={{borderRadius:'50%',width:36,height:36,background:panelAnalogsTab==='panel'?'#1976d2':'#f0f4fa',border:'none',boxShadow:panelAnalogsTab==='panel'?'0 2px 8px #1976d233':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:panelAnalogsTab==='panel'?'#fff':'#1976d2',lineHeight:1}}>+</span>
                              </button>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Секционные</span>
                              <button className={`toggle-option${panelAnalogsTab==='section'?' active':''}`} onClick={()=>setPanelAnalogsTab('section')} style={{borderRadius:'50%',width:36,height:36,background:panelAnalogsTab==='section'?'#ffb347':'#f0f4fa',border:'none',boxShadow:panelAnalogsTab==='section'?'0 2px 8px #ffb34733':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:panelAnalogsTab==='section'?'#fff':'#ffb347',lineHeight:1}}>+</span>
                              </button>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Трубчатые</span>
                              <button className={`toggle-option${panelAnalogsTab==='tube'?' active':''}`} onClick={()=>setPanelAnalogsTab('tube')} style={{borderRadius:'50%',width:36,height:36,background:panelAnalogsTab==='tube'?'#1976d2':'#f0f4fa',border:'none',boxShadow:panelAnalogsTab==='tube'?'0 2px 8px #1976d233':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:panelAnalogsTab==='tube'?'#fff':'#1976d2',lineHeight:1}}>+</span>
                              </button>
                            </div>
                          </div>
                          {panelAnalogsTab==='panel' && (
                            panelAnalogs.length>0 ? panelAnalogs.map((a,i)=>(
                              <div className="result-row" key={"panel-"+i}>
                                <span className="result-label">{a.type}, {a.length} мм, {a.height} мм</span>
                                <span className="result-value">{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                          {panelAnalogsTab==='section' && (
                            sectionAnalogs.length>0 ? sectionAnalogs.map((a,i)=>(
                              <div className="result-row" key={"section-"+i}>
                                <span className="result-label" style={{color:'#ffb347'}}>{a.sections} секц., {a.height} мм</span>
                                <span className="result-value" style={{color:'#ffb347'}}>{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                          {panelAnalogsTab==='tube' && (
                            tubeAnalogs.length>0 ? tubeAnalogs.map((a,i)=>(
                              <div className="result-row" key={"tube-"+i}>
                                <span className="result-label" style={{color:'#1976d2'}}>{a.cols} кол., {a.height} см, {a.count} секц.</span>
                                <span className="result-value" style={{color:'#1976d2'}}>{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                        </>;
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="toggle-row">
              <div className="toggle-btn">
                <button
                  className={`toggle-option${activeTab === 'panel' ? ' active' : ''}`}
                  onClick={() => setActiveTab('panel')}
                >
                  Панельный
                </button>
                <button
                  className={`toggle-option${activeTab === 'section' ? ' active' : ''}`}
                  onClick={() => setActiveTab('section')}
                >
                  Секционный
                </button>
                <button
                  className={`toggle-option${activeTab === 'tube' ? ' active' : ''}`}
                  onClick={() => setActiveTab('tube')}
                >
                  Трубчатый
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Тип радиатора</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                {Object.entries(typeNames).map(([value, name]) => (
                  <option key={value} value={value}>{name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Высота радиатора (мм)</label>
              <select value={height} onChange={e => setHeight(e.target.value)}>
                {heights.map(h => (
                  <option key={h} value={h}>{h} мм</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Длина радиатора (мм)</label>
              <select value={length} onChange={e => setLength(e.target.value)}>
                {getLengths().map(l => (
                  <option key={l} value={l}>{l} мм</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Температура подачи (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={40}
                  max={80}
                  step={5}
                  value={flowTemp}
                  onChange={e => setFlowTemp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={40}
                  max={80}
                  step={5}
                  value={flowTemp}
                  onChange={e => setFlowTemp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Температура обратки (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={40}
                  max={80}
                  step={5}
                  value={returnTemp}
                  onChange={e => setReturnTemp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={40}
                  max={80}
                  step={5}
                  value={returnTemp}
                  onChange={e => setReturnTemp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Температура воздуха (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={15}
                  max={30}
                  step={1}
                  value={roomTemp}
                  onChange={e => setRoomTemp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={15}
                  max={30}
                  step={1}
                  value={roomTemp}
                  onChange={e => setRoomTemp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
          </>
        )}
        {activeTab === 'section' && (
          <>
            <div className="results-block">
              {sectionResult && (
                <>
                  <div className="result-row">
                    <span className="result-label">Тепловая мощность</span>
                    {sectionResult.error ? (
                      <span className="result-value" style={{color: '#ff4d4f'}}>Ошибка температур</span>
                    ) : (
                      <span className="result-value">{sectionResult.power} Вт</span>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 8,
                      justifyContent: 'space-between',
                      width: '100%',
                      marginBottom: window.innerWidth <= 480 ? 8 : 20
                    }}
                  >
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,marginTop:8,width:'100%'}}>
                      <button
                        className={`spoiler-btn${sectionSpoilerOpen ? ' active' : ''}`}
                        style={{
                          ...spoilerBtnStyle,
                          ...(window.innerWidth <= 480 ? { padding: '8px 8px', fontSize: 14, gap: 6 } : {})
                        }}
                        onClick={() => setSectionSpoilerOpen(v => !v)}
                        aria-expanded={sectionSpoilerOpen}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Подробнее
                        <svg style={{transform: sectionSpoilerOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button
                        className={`spoiler-btn${sectionAnalogsOpen ? ' active' : ''}`}
                        style={{
                          ...spoilerBtnStyle,
                          ...(window.innerWidth <= 480 ? { padding: '8px 8px', fontSize: 14, gap: 6 } : {})
                        }}
                        onClick={() => setSectionAnalogsOpen(v => !v)}
                        aria-expanded={sectionAnalogsOpen}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Аналоги
                        <svg style={{transform: sectionAnalogsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                  {sectionSpoilerOpen && (
                    <div style={{paddingTop: '12px'}}>
                      <div className="result-row">
                        <span className="result-label">Высота</span>
                        <span className="result-value">{sectionResult.height} мм</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Секций</span>
                        <span className="result-value">{sectionResult.sections}</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура подачи</span>
                        <span className="result-value">{sectionResult.tp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура обратки</span>
                        <span className="result-value">{sectionResult.to}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура воздуха</span>
                        <span className="result-value">{sectionResult.tv}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Мощность секции (Δt50)</span>
                        <span className="result-value">{sectionResult.basePower} Вт</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Поправочный коэффициент</span>
                        <span className="result-value">{sectionResult.k.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {sectionAnalogsOpen && (
                    <div style={{paddingTop: '12px'}}>
                      {sectionResult && (() => {
                        const power = sectionResult.power;
                        const minPower = power * 0.9;
                        const maxPower = power * 1.1;
                        // Панельные аналоги
                        const panelAnalogs = [];
                        for (const h of heights) {
                          for (const t of Object.keys(typeNames)) {
                            for (const l of Object.keys(radiatorDB[h][t])) {
                              const p = radiatorDB[h][t][l];
                              if (p >= minPower && p <= maxPower) {
                                panelAnalogs.push({ type: t, height: h, length: l, power: p });
                              }
                            }
                          }
                        }
                        // Секционные аналоги (кроме текущего варианта)
                        const sectionAnalogs = [];
                        for (const sh of Object.keys(aluminumSectionalDB)) {
                          const base = sh === '500' ? 180 : sh === '350' ? 122 : aluminumSectionalDB[sh];
                          for (let n = 1; n <= 30; n++) {
                            const k = getAluminumCorrection(sectionResult.tp, sectionResult.to, sectionResult.tv);
                            const p = Math.round(n * base * k);
                            if (p >= minPower && p <= maxPower) {
                              if (!(sh === sectionResult.height && n === Number(sectionResult.sections))) {
                                sectionAnalogs.push({ height: sh, sections: n, power: p, k });
                              }
                            }
                          }
                        }
                        // Трубчатые аналоги
                        const tubeAnalogs = [];
                        for (const t of tubeData) {
                          const n = 1.25;
                          const deltaT = calcLogDeltaT(Number(sectionResult.tp), Number(sectionResult.to), Number(sectionResult.tv));
                          const deltaTn = 70;
                          let k = deltaT > 0 ? Math.pow(deltaT / deltaTn, n) : 0;
                          if (Math.abs(deltaT - deltaTn) < 0.5) k = 1;
                          for (let count = 1; count <= 50; count++) {
                            const p = Math.round(t.power * count * k);
                            if (p >= minPower && p <= maxPower) {
                              tubeAnalogs.push({ cols: t.cols, height: t.height, count, power: p });
                            }
                          }
                        }
                        return <>
                          <div className="analogs-toggle-row" style={{display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'center',gap:32,marginBottom:8}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Панельные</span>
                              <button className={`toggle-option${sectionAnalogsTab==='panel'?' active':''}`} onClick={()=>setSectionAnalogsTab('panel')} style={{borderRadius:'50%',width:36,height:36,background:sectionAnalogsTab==='panel'?'#1976d2':'#f0f4fa',border:'none',boxShadow:sectionAnalogsTab==='panel'?'0 2px 8px #1976d233':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:sectionAnalogsTab==='panel'?'#fff':'#1976d2',lineHeight:1}}>+</span>
                              </button>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Секционные</span>
                              <button className={`toggle-option${sectionAnalogsTab==='section'?' active':''}`} onClick={()=>setSectionAnalogsTab('section')} style={{borderRadius:'50%',width:36,height:36,background:sectionAnalogsTab==='section'?'#ffb347':'#f0f4fa',border:'none',boxShadow:sectionAnalogsTab==='section'?'0 2px 8px #ffb34733':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:sectionAnalogsTab==='section'?'#fff':'#ffb347',lineHeight:1}}>+</span>
                              </button>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Трубчатые</span>
                              <button className={`toggle-option${sectionAnalogsTab==='tube'?' active':''}`} onClick={()=>setSectionAnalogsTab('tube')} style={{borderRadius:'50%',width:36,height:36,background:sectionAnalogsTab==='tube'?'#1976d2':'#f0f4fa',border:'none',boxShadow:sectionAnalogsTab==='tube'?'0 2px 8px #1976d233':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:sectionAnalogsTab==='tube'?'#fff':'#1976d2',lineHeight:1}}>+</span>
                              </button>
                            </div>
                          </div>
                          {sectionAnalogsTab==='panel' && (
                            panelAnalogs.length>0 ? panelAnalogs.map((a,i)=>(
                              <div className="result-row" key={"panel-"+i}>
                                <span className="result-label">{a.type}, {a.length} мм, {a.height} мм</span>
                                <span className="result-value">{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                          {sectionAnalogsTab==='section' && (
                            sectionAnalogs.length>0 ? sectionAnalogs.map((a,i)=>(
                              <div className="result-row" key={"section-"+i}>
                                <span className="result-label" style={{color:'#ffb347'}}>{a.sections} секц., {a.height} мм</span>
                                <span className="result-value" style={{color:'#ffb347'}}>{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                          {sectionAnalogsTab==='tube' && (
                            tubeAnalogs.length>0 ? tubeAnalogs.map((a,i)=>(
                              <div className="result-row" key={"tube-"+i}>
                                <span className="result-label" style={{color:'#1976d2'}}>{a.cols} кол., {a.height} см, {a.count} секц.</span>
                                <span className="result-value" style={{color:'#1976d2'}}>{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                        </>;
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="toggle-row">
              <div className="toggle-btn">
                <button
                  className={`toggle-option${activeTab === 'panel' ? ' active' : ''}`}
                  onClick={() => setActiveTab('panel')}
                >
                  Панельный
                </button>
                <button
                  className={`toggle-option${activeTab === 'section' ? ' active' : ''}`}
                  onClick={() => setActiveTab('section')}
                >
                  Секционный
                </button>
                <button
                  className={`toggle-option${activeTab === 'tube' ? ' active' : ''}`}
                  onClick={() => setActiveTab('tube')}
                >
                  Трубчатый
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Высота радиатора (мм)</label>
              <select value={sectionHeight} onChange={e => setSectionHeight(e.target.value)}>
                {Object.keys(aluminumSectionalDB).map(h => (
                  <option key={h} value={h}>{h} мм</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Количество секций</label>
              <input
                type="number"
                min={1}
                max={30}
                step={1}
                value={sectionCount}
                onChange={e => setSectionCount(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="form-group">
              <label>Температура подачи (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={40}
                  max={80}
                  step={5}
                  value={sectionTp}
                  onChange={e => setSectionTp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={40}
                  max={80}
                  step={5}
                  value={sectionTp}
                  onChange={e => setSectionTp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Температура обратки (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={40}
                  max={80}
                  step={5}
                  value={sectionTo}
                  onChange={e => setSectionTo(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={40}
                  max={80}
                  step={5}
                  value={sectionTo}
                  onChange={e => setSectionTo(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Температура воздуха (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={15}
                  max={30}
                  step={1}
                  value={sectionTv}
                  onChange={e => setSectionTv(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={15}
                  max={30}
                  step={1}
                  value={sectionTv}
                  onChange={e => setSectionTv(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
          </>
        )}
        {activeTab === 'tube' && (
          <>
            <div className="results-block">
              {tubeResult && (
                <>
                  <div className="result-row">
                    <span className="result-label">Тепловая мощность</span>
                    {tubeResult.error ? (
                      <span className="result-value" style={{color: '#ff4d4f'}}>Ошибка температур</span>
                    ) : (
                      <span className="result-value">{tubeResult.power} Вт</span>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 8,
                      justifyContent: 'space-between',
                      width: '100%',
                      marginBottom: window.innerWidth <= 480 ? 8 : 20
                    }}
                  >
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,marginTop:8,width:'100%'}}>
                      <button
                        className={`spoiler-btn${tubeSpoilerOpen ? ' active' : ''}`}
                        style={{
                          ...spoilerBtnStyle,
                          ...(window.innerWidth <= 480 ? { padding: '8px 8px', fontSize: 14, gap: 6 } : {})
                        }}
                        onClick={() => setTubeSpoilerOpen(v => !v)}
                        aria-expanded={tubeSpoilerOpen}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Подробнее
                        <svg style={{transform: tubeSpoilerOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button
                        className={`spoiler-btn${tubeAnalogsOpen ? ' active' : ''}`}
                        style={{
                          ...spoilerBtnStyle,
                          ...(window.innerWidth <= 480 ? { padding: '8px 8px', fontSize: 14, gap: 6 } : {})
                        }}
                        onClick={() => setTubeAnalogsOpen(v => !v)}
                        aria-expanded={tubeAnalogsOpen}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Аналоги
                        <svg style={{transform: tubeAnalogsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                  {tubeSpoilerOpen && (
                    <div style={{paddingTop: '12px'}}>
                      <div className="result-row">
                        <span className="result-label">Температура подачи</span>
                        <span className="result-value">{tubeResult.flowTemp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура обратки</span>
                        <span className="result-value">{tubeResult.returnTemp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Температура воздуха</span>
                        <span className="result-value">{tubeResult.roomTemp}°C</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Мощность секции (Δt70)</span>
                        <span className="result-value">{tubeResult.basePower} Вт</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Поправочный коэффициент</span>
                        <span className="result-value">{tubeResult.k}</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Δt (логарифм.)</span>
                        <span className="result-value">{tubeResult.deltaT}</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Δtₙ (паспорт)</span>
                        <span className="result-value">{tubeResult.deltaTn}</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Высота радиатора</span>
                        <span className="result-value">{tubeResult.heightMM} мм</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Межосевое расстояние</span>
                        <span className="result-value">{tubeResult.centerDistanceMM} мм</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Глубина</span>
                        <span className="result-value">{tubeResult.depthMM} мм</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Колонок</span>
                        <span className="result-value">{tubeResult.cols}</span>
                      </div>
                      <div className="result-row">
                        <span className="result-label">Секций</span>
                        <span className="result-value">{tubeResult.count}</span>
                      </div>
                    </div>
                  )}
                  {tubeAnalogsOpen && (
                    <div style={{paddingTop: '12px'}}>
                      {tubeResult && (() => {
                        const power = tubeResult.power;
                        const minPower = power * 0.9;
                        const maxPower = power * 1.1;
                        // Панельные аналоги
                        const panelAnalogs = [];
                        for (const h of heights) {
                          for (const t of Object.keys(typeNames)) {
                            for (const l of Object.keys(radiatorDB[h][t])) {
                              const p = radiatorDB[h][t][l];
                              if (p >= minPower && p <= maxPower) {
                                panelAnalogs.push({ type: t, height: h, length: l, power: p });
                              }
                            }
                          }
                        }
                        // Секционные аналоги
                        const sectionAnalogs = [];
                        for (const sh of Object.keys(aluminumSectionalDB)) {
                          const base = sh === '500' ? 180 : sh === '350' ? 122 : aluminumSectionalDB[sh];
                          for (let n = 1; n <= 30; n++) {
                            const k = getAluminumCorrection(tubeResult.flowTemp, tubeResult.returnTemp, tubeResult.roomTemp);
                            const p = Math.round(n * base * k);
                            if (p >= minPower && p <= maxPower) {
                              sectionAnalogs.push({ height: sh, sections: n, power: p, k });
                            }
                          }
                        }
                        // Трубчатые аналоги
                        const tubeAnalogs = [];
                        for (const t of tubeData) {
                          const n = 1.25;
                          const deltaT = calcLogDeltaT(Number(tubeResult.flowTemp), Number(tubeResult.returnTemp), Number(tubeResult.roomTemp));
                          const deltaTn = 70;
                          let k = deltaT > 0 ? Math.pow(deltaT / deltaTn, n) : 0;
                          if (Math.abs(deltaT - deltaTn) < 0.5) k = 1;
                          for (let count = 1; count <= 50; count++) {
                            const p = Math.round(t.power * count * k);
                            if (p >= minPower && p <= maxPower) {
                              tubeAnalogs.push({ cols: t.cols, height: t.height, count, power: p });
                            }
                          }
                        }
                        return <>
                          <div className="analogs-toggle-row" style={{display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'center',gap:32,marginBottom:8}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Панельные</span>
                              <button className={`toggle-option${tubeAnalogsTab==='panel'?' active':''}`} onClick={()=>setTubeAnalogsTab('panel')} style={{borderRadius:'50%',width:36,height:36,background:tubeAnalogsTab==='panel'?'#1976d2':'#f0f4fa',border:'none',boxShadow:tubeAnalogsTab==='panel'?'0 2px 8px #1976d233':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:tubeAnalogsTab==='panel'?'#fff':'#1976d2',lineHeight:1}}>+</span>
                              </button>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Секционные</span>
                              <button className={`toggle-option${tubeAnalogsTab==='section'?' active':''}`} onClick={()=>setTubeAnalogsTab('section')} style={{borderRadius:'50%',width:36,height:36,background:tubeAnalogsTab==='section'?'#ffb347':'#f0f4fa',border:'none',boxShadow:tubeAnalogsTab==='section'?'0 2px 8px #ffb34733':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:tubeAnalogsTab==='section'?'#fff':'#ffb347',lineHeight:1}}>+</span>
                              </button>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:60}}>
                              <span style={{fontSize:12,color:'#888',marginBottom:2}}>Трубчатые</span>
                              <button className={`toggle-option${tubeAnalogsTab==='tube'?' active':''}`} onClick={()=>setTubeAnalogsTab('tube')} style={{borderRadius:'50%',width:36,height:36,background:tubeAnalogsTab==='tube'?'#1976d2':'#f0f4fa',border:'none',boxShadow:tubeAnalogsTab==='tube'?'0 2px 8px #1976d233':'none',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
                                <span style={{fontSize:22,fontWeight:'bold',color:tubeAnalogsTab==='tube'?'#fff':'#1976d2',lineHeight:1}}>+</span>
                              </button>
                            </div>
                          </div>
                          {tubeAnalogsTab==='panel' && (
                            panelAnalogs.length>0 ? panelAnalogs.map((a,i)=>(
                              <div className="result-row" key={"panel-"+i}>
                                <span className="result-label">{a.type}, {a.length} мм, {a.height} мм</span>
                                <span className="result-value">{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                          {tubeAnalogsTab==='section' && (
                            sectionAnalogs.length>0 ? sectionAnalogs.map((a,i)=>(
                              <div className="result-row" key={"section-"+i}>
                                <span className="result-label" style={{color:'#ffb347'}}>{a.sections} секц., {a.height} мм</span>
                                <span className="result-value" style={{color:'#ffb347'}}>{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                          {tubeAnalogsTab==='tube' && (
                            tubeAnalogs.length>0 ? tubeAnalogs.map((a,i)=>(
                              <div className="result-row" key={"tube-"+i}>
                                <span className="result-label" style={{color:'#1976d2'}}>{a.cols} кол., {a.height} см, {a.count} секц.</span>
                                <span className="result-value" style={{color:'#1976d2'}}>{a.power} Вт</span>
                              </div>
                            )) : <div className="result-row"><span className="result-label">Нет аналогов</span></div>
                          )}
                        </>;
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="toggle-row">
              <div className="toggle-btn">
                <button
                  className={`toggle-option${activeTab === 'panel' ? ' active' : ''}`}
                  onClick={() => setActiveTab('panel')}
                >
                  Панельный
                </button>
                <button
                  className={`toggle-option${activeTab === 'section' ? ' active' : ''}`}
                  onClick={() => setActiveTab('section')}
                >
                  Секционный
                </button>
                <button
                  className={`toggle-option${activeTab === 'tube' ? ' active' : ''}`}
                  onClick={() => setActiveTab('tube')}
                >
                  Трубчатый
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Колонок</label>
              <select value={tubeCols} onChange={e => setTubeCols(Number(e.target.value))}>
                {[2,3].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Высота секции (см)</label>
              <select value={tubeHeight} onChange={e => setTubeHeight(Number(e.target.value))}>
                {[...new Set(tubeData.filter(t => t.cols === tubeCols).map(t => t.height))].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Количество секций</label>
              <input
                type="number"
                min={1}
                max={50}
                step={1}
                value={tubeCount}
                onChange={e => setTubeCount(Number(e.target.value))}
                inputMode="numeric"
              />
            </div>
            <div className="form-group">
              <label>Температура подачи (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={40}
                  max={80}
                  step={5}
                  value={tubeFlowTemp}
                  onChange={e => setTubeFlowTemp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={40}
                  max={80}
                  step={5}
                  value={tubeFlowTemp}
                  onChange={e => setTubeFlowTemp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Температура обратки (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={40}
                  max={80}
                  step={5}
                  value={tubeReturnTemp}
                  onChange={e => setTubeReturnTemp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={40}
                  max={80}
                  step={5}
                  value={tubeReturnTemp}
                  onChange={e => setTubeReturnTemp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Температура воздуха (°C)</label>
              <div className="slider-block" style={{flexDirection:'column',alignItems:'center',gap:6}}>
                <input
                  type="number"
                  min={15}
                  max={30}
                  step={1}
                  value={tubeRoomTemp}
                  onChange={e => setTubeRoomTemp(Number(e.target.value))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{width:56,textAlign:'center',marginBottom:4}}
                />
                <input
                  type="range"
                  min={15}
                  max={30}
                  step={1}
                  value={tubeRoomTemp}
                  onChange={e => setTubeRoomTemp(Number(e.target.value))}
                  style={{width:'100%'}}
                />
              </div>
            </div>
          </>
        )}
        <div className={`tooltip${tooltip ? ' active' : ''}`} style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          width: '400px',
          zIndex: 1000
        }}>
          <strong>Формула расчёта:</strong>
          <span className="formula">Q = Qₙ × k</span>
          <b>Q</b> — фактическая мощность (Вт)<br />
          <b>Qₙ</b> — номинальная мощность (Вт)<br />
          <b>k</b> — поправочный коэффициент<br />
          <br />
          {activeTab === 'section' && (
            <>
              <b>Примечание:</b><br />
              Расчёт выполняется для <b>алюминиевых радиаторов</b>.<br />
              Тепловая мощность указана для <b>диагонального подключения (верх-низ)</b>.<br />
            </>
          )}
          {activeTab === 'tube' && (
            <>
              <b>Примечание:</b><br />
              Тепловая мощность указана для <b>диагонального подключения (верх-низ)</b>.<br />
            </>
          )}
        </div>
        <div className="footer-signature">Galf Design</div>
      </div>
      <div className="footer-signature" style={{
        marginTop: 32,
        background: '#f6f7fa',
        borderRadius: 14,
        padding: '22px 16px 20px 16px',
        color: '#232837',
        fontSize: '1.08em',
        lineHeight: 1.85,
        boxShadow: '0 2px 12px 0 rgba(76,201,240,0.07)',
        border: '1.5px solid #e0e4ea',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        textAlign: 'left',
        letterSpacing: 0.01
      }}>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Зачем нужен?</span><br/>
          Этот калькулятор позволяет рассчитать необходимую мощность радиатора для отопления помещения с учетом температурного графика, типа радиатора и условий эксплуатации. Помогает подобрать оптимальный радиатор для эффективного и комфортного отопления.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Как применяется?</span><br/>
          Введите параметры помещения, температурный режим, выберите тип и размеры радиатора. Калькулятор рассчитает требуемую мощность, количество секций или длину, а также предложит аналоги. Это помогает выбрать подходящий радиатор и сравнить варианты.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:0}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Используемая методика</span><br/>
          <span style={{display:'inline-block',color:'#232837',background:'#e6f3fa',padding:'7px 15px',borderRadius:7,fontFamily:'Consolas,Menlo,monospace',fontSize:'1.13em',margin:'12px 0 10px 0',letterSpacing:0.01}}>Q = Qₙ × k</span><br/>
          <span style={{color:'#4b5a6a'}}>Q</span> — фактическая мощность, <span style={{color:'#4b5a6a'}}>Qₙ</span> — номинальная мощность радиатора, <span style={{color:'#4b5a6a'}}>k</span> — поправочный коэффициент по температурному графику. Для секционных и трубчатых радиаторов учитываются паспортные данные и корректировки по Δt. Методика соответствует СП 60.13330 и рекомендациям производителей.
        </div>
        <div style={{margin:'18px 0 18px 0',borderTop:'1px solid #e0e4ea'}}></div>
        <div style={{marginBottom:18}}>
          <span style={{color:'#4b5a6a',fontWeight:700, fontSize:'1.07em'}}>Пример практического применения</span><br/>
          <div style={{background:'#f0f4fa', color:'#232837', borderRadius:8, padding:'13px 15px', margin:'12px 0 0 0', fontSize:'0.99em', lineHeight:1.7, boxShadow:'0 1px 6px #4cc9f00a'}}>
            <b>Задача:</b> Необходимо подобрать радиатор для комнаты 18 м² с температурным графиком <b>70/55/20°C</b>.<br/><br/>
            <b>Решение:</b> Вводим параметры помещения, выбираем тип радиатора и температурный режим. Калькулятор рассчитает требуемую мощность и предложит подходящие модели и аналоги.<br/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiatorCalculator;
interface ClimateData {
  [region: string]: {
    [city: string]: {
      degreeDays: number;
    }
  }
}

const CLIMATE_DATA: ClimateData = {}; 
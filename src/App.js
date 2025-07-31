import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainMenu from './components/MainMenu';
import CalculatorPage from './components/CalculatorPage';
import FlowCalculator from './components/FlowCalculator';
import LiquidSpeedCalculator from './components/LiquidSpeedCalculator';
import FlowByDiameterCalculator from './components/FlowByDiameterCalculator';
import HydraulicResistanceCalculator from './components/HydraulicResistanceCalculator';
import PumpSelectionCalculator from './components/PumpSelectionCalculator';
import VentilationHeatingCalculator from './components/VentilationHeatingCalculator';
import FuelCostCalculator from './components/FuelCostCalculator';
import BuildingClimatology from './components/BuildingClimatology';
import NewProcessCalculator from './components/NewProcessCalculator';
import PipeFreezingCalculator from './components/PipeFreezingCalculator';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
    },
    secondary: {
      main: '#34a853',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  const showCalculator = (pageId, title, url) => {
    if (currentPage === pageId) {
      hideCalculator();
      return;
    }
    setCurrentPage(pageId);
    setPageTitle(title);
    setPageUrl(url);
  };

  const hideCalculator = () => {
    setCurrentPage(null);
    setPageTitle('');
    setPageUrl('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        {!currentPage ? (
          <MainMenu onShowCalculator={showCalculator} />
        ) : currentPage === 'flowCalculator' ? (
          <FlowCalculator onBack={hideCalculator} />
        ) : currentPage === 'liquidSpeedCalculator' ? (
          <LiquidSpeedCalculator onBack={hideCalculator} />
        ) : currentPage === 'flowByDiameterCalculator' ? (
          <FlowByDiameterCalculator onBack={hideCalculator} />
        ) : currentPage === 'hydraulicResistanceCalculator' ? (
          <HydraulicResistanceCalculator onBack={hideCalculator} />
        ) : currentPage === 'pumpSelectionCalculator' ? (
          <PumpSelectionCalculator onBack={hideCalculator} />
        ) : currentPage === 'ventilationHeatingCalculator' ? (
          <VentilationHeatingCalculator onBack={hideCalculator} />
        ) : currentPage === 'fuelCostCalculator' ? (
          <FuelCostCalculator onBack={hideCalculator} />
        ) : currentPage === 'buildingClimatology' ? (
          <BuildingClimatology onBack={hideCalculator} />
        ) : currentPage === 'newProcessCalculator' ? (
          <NewProcessCalculator onBack={hideCalculator} />
        ) : currentPage === 'pipeFreezingCalculator' ? (
          <PipeFreezingCalculator onBack={hideCalculator} />
        ) : (
          <CalculatorPage
            id={currentPage}
            title={pageTitle}
            url={pageUrl}
            onBack={hideCalculator}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App; 
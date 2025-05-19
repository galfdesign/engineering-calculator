import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainMenu from './components/MainMenu';
import CalculatorPage from './components/CalculatorPage';
import FlowCalculator from './components/FlowCalculator';
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
        ) : (
          <CalculatorPage
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
import React from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: theme.spacing(2.5),
  backgroundColor: 'white',
  zIndex: 100,
  overflowY: 'auto',
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
}));

const StyledIframe = styled('iframe')(({ theme }) => ({
  width: '100%',
  height: 'calc(100vh - 120px)',
  border: 'none',
  marginTop: theme.spacing(1.25),
  borderRadius: theme.spacing(1),
}));

const CalculatorPage = ({ title, url, onBack }) => {
  return (
    <PageContainer>
      <BackButton onClick={onBack}>←</BackButton>
      <Typography variant="h5" component="h2" color="primary" gutterBottom>
        {title}
      </Typography>
      <StyledIframe src={url} title={title} />
    </PageContainer>
  );
};

export default CalculatorPage; 
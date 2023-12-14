import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Paper,
} from '@mui/material';

const LoanCalculatorForm = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [initialRepayment, setInitialRepayment] = useState('');
  const [fixedInterestPeriod, setFixedInterestPeriod] = useState('');

  const [calculationResult, setCalculationResult] = useState(null);
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);

  const calculateLoan = async () => {
    try {
      const response = await fetch('http://localhost:5000/calculate-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount: parseFloat(loanAmount),
          interestRate: parseFloat(interestRate),
          initialRepayment: parseFloat(initialRepayment),
          fixedInterestPeriod: fixedInterestPeriod
            ? parseInt(fixedInterestPeriod)
            : 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setCalculationResult(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleCalculate = async () => {
    calculateLoan();
    setHasCalculatedOnce(true);
  };

  useEffect(() => {
    if (hasCalculatedOnce) {
      calculateLoan();
    }
  }, [loanAmount, interestRate, initialRepayment, fixedInterestPeriod]);

  return (
    <Container maxWidth='sm'>
      <Typography variant='h6' gutterBottom>
        Tilgungsplan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label='Darlehensbetrag'
            fullWidth
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label='Sollzins (%)'
            fullWidth
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label='anfängliche Tilgung (%)'
            fullWidth
            value={initialRepayment}
            onChange={(e) => setInitialRepayment(e.target.value)}
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            label='Zinsbindungsdauer (Jahre)'
            fullWidth
            value={fixedInterestPeriod}
            onChange={(e) => setFixedInterestPeriod(e.target.value)}
            helperText='Optional'
          >
            {[...Array(30).keys()].map((year) => (
              <MenuItem key={year + 1} value={year + 1}>
                {year + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' onClick={handleCalculate}>
            Berechnen
          </Button>
        </Grid>
      </Grid>
      {calculationResult && (
        <Paper style={{ marginTop: '20px', padding: '15px' }}>
          <Typography variant='h6'>Berechnungsergebnis:</Typography>
          <Typography>Rate: {calculationResult.monthlyRate}</Typography>

          <Typography>
            Restschuld am Ende der Sollzinsbindung:{' '}
            {calculationResult.remainingDebt}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default LoanCalculatorForm;

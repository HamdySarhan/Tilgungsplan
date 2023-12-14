const express = require('express');
const router = express.Router();

function calculateLoanSummary(
  loanAmount,
  interestRate,
  initialRepayment,
  fixedInterestPeriod
) {
  const monthlyInterestRate = interestRate / 100 / 12;

  const effectiveMonthlyRate =
    monthlyInterestRate + initialRepayment / 100 / 12;
  const monthlyPayment = loanAmount * effectiveMonthlyRate;

  let remainingDebt = loanAmount;

  for (let month = 1; month <= fixedInterestPeriod * 12; month++) {
    let interestForMonth = remainingDebt * monthlyInterestRate;
    let principalForMonth = monthlyPayment - interestForMonth;

    remainingDebt -= principalForMonth;

    if (remainingDebt < 0) {
      remainingDebt = 0;
      break;
    }
  }

  return {
    monthlyRate: monthlyPayment.toFixed(2),
    remainingDebt: remainingDebt.toFixed(2),
  };
}

router.post('/calculate-loan', (req, res) => {
  const { loanAmount, interestRate, initialRepayment, fixedInterestPeriod } =
    req.body;

  if (!loanAmount || !interestRate || !initialRepayment) {
    return res.status(400).send('Missing required parameters');
  }

  const result = calculateLoanSummary(
    loanAmount,
    interestRate,
    initialRepayment,
    fixedInterestPeriod || 0
  );
  res.json(result);
});

module.exports = router;

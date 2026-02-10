
import { 
  TAX_BRACKETS, 
  PRIMARY_REBATE, 
  UIF_RATE, 
  UIF_CAP, 
  MEDICAL_CREDIT_MAIN, 
  MEDICAL_CREDIT_FIRST_DEP, 
  MEDICAL_CREDIT_ADDITIONAL,
  RETIREMENT_FUND_RATE_CAP,
  RETIREMENT_FUND_ANNUAL_CAP
} from '../constants';
import { PayrollItem } from '../types';

export const calculateAdvancedPayroll = (items: PayrollItem[], medicalDependents: number) => {
  // 1. Calculate Gross Earnings
  const taxableEarnings = items
    .filter(i => i.type === 'EARNING' || i.type === 'FRINGE_BENEFIT')
    .filter(i => i.isTaxable)
    .reduce((sum, i) => sum + i.amount, 0);

  const nonTaxableEarnings = items
    .filter(i => i.type === 'REIMBURSEMENT' || (i.type === 'EARNING' && !i.isTaxable))
    .reduce((sum, i) => sum + i.amount, 0);

  // 2. Retirement Fund Deductions (Tax relief)
  const retirementContributions = items
    .filter(i => i.code === '4001' || i.code === '4003')
    .reduce((sum, i) => sum + i.amount, 0);
  
  // Cap relief at 27.5% of taxable earnings or R350k/12
  const maxRelief = Math.min(
    taxableEarnings * RETIREMENT_FUND_RATE_CAP,
    RETIREMENT_FUND_ANNUAL_CAP / 12
  );
  const effectiveTaxRelief = Math.min(retirementContributions, maxRelief);

  // 3. Taxable Income
  const monthlyTaxableIncome = Math.max(0, taxableEarnings - effectiveTaxRelief);
  const annualTaxableIncome = monthlyTaxableIncome * 12;

  // 4. PAYE Calculation
  let annualTax = 0;
  let prevLimit = 0;
  for (const bracket of TAX_BRACKETS) {
    if (annualTaxableIncome <= bracket.limit) {
      annualTax = bracket.base + (annualTaxableIncome - prevLimit) * bracket.rate;
      break;
    }
    prevLimit = bracket.limit;
  }

  // Subtract Rebate
  let monthlyPAYE = Math.max(0, annualTax - PRIMARY_REBATE) / 12;

  // 5. Medical Aid Tax Credits (Section 6A)
  if (items.some(i => i.code === '4005')) {
    let medicalCredit = MEDICAL_CREDIT_MAIN;
    if (medicalDependents >= 1) medicalCredit += MEDICAL_CREDIT_FIRST_DEP;
    if (medicalDependents > 1) medicalCredit += (medicalDependents - 1) * MEDICAL_CREDIT_ADDITIONAL;
    monthlyPAYE = Math.max(0, monthlyPAYE - medicalCredit);
  }

  // 6. UIF
  // Note: fringe benefits are usually excluded from UIF, but basic + commission are included.
  const uifGross = items
    .filter(i => i.code === '3601' || i.code === '3606')
    .reduce((sum, i) => sum + i.amount, 0);
  const monthlyUIF = Math.min(uifGross * UIF_RATE, UIF_CAP);

  // 7. Net Pay
  const totalEarnings = items
    .filter(i => i.type === 'EARNING' || i.type === 'REIMBURSEMENT')
    .reduce((sum, i) => sum + i.amount, 0);
  
  const totalDeductions = items
    .filter(i => i.type === 'DEDUCTION')
    .reduce((sum, i) => sum + i.amount, 0) + monthlyPAYE + monthlyUIF;

  return {
    grossEarnings: totalEarnings,
    taxableIncome: monthlyTaxableIncome,
    paye: monthlyPAYE,
    uif: monthlyUIF,
    totalDeductions,
    netPay: totalEarnings - totalDeductions
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

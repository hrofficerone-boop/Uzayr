
// 2024/2025 Tax Year
export const TAX_BRACKETS = [
  { limit: 237100, rate: 0.18, base: 0 },
  { limit: 370500, rate: 0.26, base: 42678 },
  { limit: 512800, rate: 0.31, base: 77362 },
  { limit: 673000, rate: 0.36, base: 121475 },
  { limit: 857900, rate: 0.39, base: 179147 },
  { limit: 1817000, rate: 0.41, base: 251258 },
  { limit: Infinity, rate: 0.45, base: 644489 }
];

export const PRIMARY_REBATE = 17235;
export const UIF_RATE = 0.01;
export const UIF_CAP = 177.12;

// Medical Scheme Fees Tax Credits (Monthly)
export const MEDICAL_CREDIT_MAIN = 364;
export const MEDICAL_CREDIT_FIRST_DEP = 364;
export const MEDICAL_CREDIT_ADDITIONAL = 246;

// Retirement Fund Limit (Section 11(k))
export const RETIREMENT_FUND_RATE_CAP = 0.275;
export const RETIREMENT_FUND_ANNUAL_CAP = 350000;

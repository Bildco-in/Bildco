export const DAYS_PER_MONTH = 30;

export type CalcInput = {
  missedCallsPerDay: number;
  conversionPercent: number;
  avgCustomerValue: number;
};

function clean(n: number, max: number) {
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

export function monthlyRevenueLost({ missedCallsPerDay, conversionPercent, avgCustomerValue }: CalcInput) {
  const calls = clean(missedCallsPerDay, 10_000);
  const rate = clean(conversionPercent, 100) / 100;
  const value = clean(avgCustomerValue, 100_000_000);
  const lostCustomers = calls * DAYS_PER_MONTH * rate;
  return {
    missedCallsPerMonth: calls * DAYS_PER_MONTH,
    lostCustomers,
    revenueLost: Math.round(lostCustomers * value),
  };
}

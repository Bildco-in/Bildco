import { describe, expect, it } from "vitest";
import { monthlyRevenueLost } from "./calc";

describe("monthlyRevenueLost", () => {
  it("multiplies calls x 30 days x conversion x value", () => {
    const r = monthlyRevenueLost({ missedCallsPerDay: 10, conversionPercent: 20, avgCustomerValue: 500 });
    expect(r.missedCallsPerMonth).toBe(300);
    expect(r.lostCustomers).toBe(60);
    expect(r.revenueLost).toBe(30000);
  });

  it("treats negative and non-numeric input as zero", () => {
    expect(monthlyRevenueLost({ missedCallsPerDay: -5, conversionPercent: 20, avgCustomerValue: 500 }).revenueLost).toBe(0);
    expect(monthlyRevenueLost({ missedCallsPerDay: NaN, conversionPercent: 20, avgCustomerValue: 500 }).revenueLost).toBe(0);
  });

  it("caps conversion at 100%", () => {
    expect(monthlyRevenueLost({ missedCallsPerDay: 1, conversionPercent: 250, avgCustomerValue: 100 }).revenueLost).toBe(3000);
  });
});

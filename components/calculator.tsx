"use client";

import { useId, useState } from "react";
import { monthlyRevenueLost } from "@/lib/calc";
import { formatInr } from "@/lib/site";
import { Container, CtaLink, SectionHeader, consultation } from "./ui";

type FieldProps = {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

function Field({ label, hint, value, onChange, min, max, step, prefix, suffix }: FieldProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="font-semibold">
          {label}
          <span className="block text-sm font-normal text-muted">{hint}</span>
        </label>
        <div className="flex shrink-0 items-center rounded-xl border-2 border-line bg-white px-3 focus-within:border-saffron">
          {prefix ? <span className="text-muted" aria-hidden="true">{prefix}</span> : null}
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
            className="h-11 w-24 bg-transparent text-right text-lg font-semibold tabular-nums outline-none"
          />
          {suffix ? <span className="pl-1 text-muted" aria-hidden="true">{suffix}</span> : null}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? Math.min(value, max) : min}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-2 w-full cursor-pointer accent-saffron-deep"
      />
    </div>
  );
}

export function Calculator() {
  const [calls, setCalls] = useState(5);
  const [conversion, setConversion] = useState(20);
  const [value, setValue] = useState(1000);

  const result = monthlyRevenueLost({
    missedCallsPerDay: calls,
    conversionPercent: conversion,
    avgCustomerValue: value,
  });

  return (
    <section id="calculator" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Missed-call calculator"
          title="How much is an unanswered phone costing you?"
          lead="Put in your own numbers. Be honest, nobody's watching."
        />
        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-line lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-9 bg-white p-7 sm:p-10">
            <Field
              label="Missed calls & messages per day"
              hint="Calls you couldn't pick up, chats left unanswered"
              value={calls}
              onChange={setCalls}
              min={0}
              max={100}
              step={1}
            />
            <Field
              label="How many would have become customers"
              hint="Out of every 100 enquiries"
              value={conversion}
              onChange={setConversion}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
            <Field
              label="Average customer value"
              hint="What one customer spends with you"
              value={value}
              onChange={setValue}
              min={0}
              max={100000}
              step={100}
              prefix="₹"
            />
          </div>
          <div className="flex flex-col justify-center bg-ink p-7 text-paper sm:p-10" aria-live="polite">
            <p className="text-paper/70">Revenue lost every month</p>
            <p className="font-display mt-2 break-words text-5xl font-extrabold tracking-tight text-saffron tabular-nums sm:text-6xl">
              {formatInr(result.revenueLost)}
            </p>
            <p className="font-display mt-4 text-2xl font-bold">This is what silence costs you.</p>
            <p className="mt-4 text-paper/65">
              {Math.round(result.missedCallsPerMonth).toLocaleString("en-IN")} missed enquiries a month,{" "}
              about {Math.round(result.lostCustomers).toLocaleString("en-IN")} customers who went somewhere else.
            </p>
            <CtaLink href={consultation.href} external={consultation.external} className="mt-8 self-start">
              Stop losing them
            </CtaLink>
            <p className="mt-6 text-xs text-paper/45">
              Estimate based only on the numbers you enter, over a 30-day month.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

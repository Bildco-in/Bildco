import { cn } from "./ui";

// Deterministic bar heights so server and client render the same markup.
const BARS = [28, 46, 64, 38, 82, 56, 96, 70, 44, 88, 60, 100, 72, 50, 90, 66, 40, 78, 54, 34, 62, 86, 48, 30];

export function SoundWave({ className, bars = BARS.length }: { className?: string; bars?: number }) {
  return (
    <div className={cn("flex h-full items-center justify-center gap-[5px]", className)} aria-hidden="true">
      {BARS.slice(0, bars).map((h, i) => (
        <span
          key={i}
          className="animate-wave block w-[5px] origin-center rounded-full bg-gradient-to-t from-saffron-deep via-saffron to-[#ffd29a] sm:w-[6px]"
          style={{ height: `${h}%`, animationDelay: `${(i % 8) * -0.15}s`, animationDuration: `${1 + (i % 5) * 0.18}s` }}
        />
      ))}
    </div>
  );
}

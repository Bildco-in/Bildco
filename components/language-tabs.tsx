"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LanguageSample } from "@/lib/languages";
import { SoundWave } from "./sound-wave";
import { cn } from "./ui";

type Sample = LanguageSample & { audioSrc: string | null };

const scriptClass = { telugu: "font-telugu", deva: "font-deva", latin: "" } as const;

export function LanguageTabs({ samples }: { samples: Sample[] }) {
  const [activeId, setActiveId] = useState(samples[0].id);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const active = samples.find((s) => s.id === activeId) ?? samples[0];

  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [activeId]);

  function toggleAudio() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : samples.length - 1)) % samples.length;
    setActiveId(samples[next].id);
    document.getElementById(`lang-tab-${samples[next].id}`)?.focus();
  }

  return (
    <div className="mt-12">
      <div role="tablist" aria-label="Choose a language" className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        {samples.map((s, i) => {
          const selected = s.id === activeId;
          return (
            <button
              key={s.id}
              id={`lang-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="lang-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "min-h-14 rounded-2xl border-2 px-6 py-3 text-left transition-colors sm:min-w-40",
                selected ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink/50",
              )}
            >
              <span className={cn("block text-lg font-semibold", scriptClass[s.script])}>{s.nativeLabel}</span>
              {s.nativeLabel !== s.label ? (
                <span className={cn("text-sm", selected ? "text-paper/60" : "text-muted")}>{s.label}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        id="lang-panel"
        role="tabpanel"
        aria-labelledby={`lang-tab-${active.id}`}
        className="mt-5 grid gap-6 rounded-[2rem] bg-paper p-6 sm:p-9 lg:grid-cols-[280px_1fr]"
      >
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-ink p-6 text-paper">
          <div>
            <p className="text-sm text-paper/60">Sample scenario</p>
            <p className="font-display mt-1 text-xl font-bold">{active.scenario}</p>
          </div>
          <div className="h-16">
            <SoundWave bars={18} className={playing ? "" : "[&>span]:[animation-play-state:paused]"} />
          </div>
          {active.audioSrc ? (
            <>
              <audio
                ref={audioRef}
                key={active.audioSrc}
                src={active.audioSrc}
                preload="none"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
              <button
                type="button"
                onClick={toggleAudio}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-saffron px-6 font-semibold text-ink hover:bg-[#ffab48]"
              >
                {playing ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
                {playing ? "Pause" : `Play ${active.label} sample`}
              </button>
            </>
          ) : (
            <p className="text-sm text-paper/60">Audio sample coming soon. Read the conversation for now.</p>
          )}
        </div>

        <ol className={cn("space-y-3 self-center text-[17px] leading-relaxed", scriptClass[active.script])} lang={langAttr(active.id)}>
          {active.lines.map((line, i) => (
            <li
              key={i}
              className={cn(
                "max-w-[90%] rounded-2xl px-5 py-3",
                line.who === "customer" ? "rounded-tl-sm bg-sand" : "ml-auto rounded-tr-sm bg-saffron-soft",
              )}
            >
              <span className="mb-0.5 block font-sans text-xs font-semibold uppercase tracking-wider text-muted">
                {line.who === "customer" ? "Customer" : "Bildco agent"}
              </span>
              {line.text}
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-3 text-sm text-muted">Sample conversations written to show how the agent talks. Not real customer calls.</p>
    </div>
  );
}

function langAttr(id: Sample["id"]) {
  return { telugu: "te", hindi: "hi", english: "en", hinglish: "hi-Latn" }[id];
}

"use client";

import { Mic, PhoneOff, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VoiceEvent } from "@/lib/agent/voice-events";
import { SoundWave } from "../sound-wave";
import { cn } from "@/lib/cn";

type Turn = { role: "user" | "assistant"; content: string };
type Status = "idle" | "connecting" | "listening" | "thinking" | "speaking";

const SPEECH_RMS = 0.025; // mic level that counts as speech
const END_SILENCE_MS = 1200; // pause that ends a turn
const NO_SPEECH_MS = 12000; // hang up if the visitor says nothing
const MAX_TURN_MS = 25000;
const MAX_TURNS = 10;

const statusLabel: Record<Status, string> = {
  idle: "Tap to start a call",
  connecting: "Connecting…",
  listening: "Listening… speak now",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

function pickMime() {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return options.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) ?? "";
}

function base64ToBuffer(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function VoiceAgent() {
  const [status, setStatus] = useState<Status>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [liveReply, setLiveReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const activeRef = useRef(false);
  const turnsRef = useRef<Turn[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const playheadRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const listenRef = useRef<() => void>(() => {});
  const turnIdRef = useRef(0);

  const stopPlayback = useCallback(() => {
    sourcesRef.current.forEach((s) => {
      try {
        s.stop();
      } catch {}
    });
    sourcesRef.current = [];
    playheadRef.current = 0;
  }, []);

  const endCall = useCallback(() => {
    activeRef.current = false;
    turnIdRef.current++;
    abortRef.current?.abort();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
    stopPlayback();
    setStatus("idle");
    setLiveReply("");
  }, [stopPlayback]);

  useEffect(() => endCall, [endCall]);

  const sendTurn = useCallback(
    async (audio: Blob) => {
      const ctx = ctxRef.current!;
      const turnId = ++turnIdRef.current;
      const stale = () => !activeRef.current || turnId !== turnIdRef.current;
      setStatus("thinking");
      setLiveReply("");
      const controller = new AbortController();
      abortRef.current = controller;

      const form = new FormData();
      form.append("audio", audio, "turn");
      form.append("history", JSON.stringify(turnsRef.current));

      let reply = "";
      let decodeChain = Promise.resolve();
      let lastEnd = Promise.resolve();

      const enqueueAudio = (b64: string) => {
        decodeChain = decodeChain.then(async () => {
          const buffer = await ctx.decodeAudioData(base64ToBuffer(b64));
          if (stale()) return;
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          const startAt = Math.max(ctx.currentTime + 0.05, playheadRef.current);
          source.start(startAt);
          playheadRef.current = startAt + buffer.duration;
          sourcesRef.current.push(source);
          setStatus("speaking");
          lastEnd = new Promise((resolve) => (source.onended = () => resolve()));
        });
      };

      try {
        const res = await fetch("/api/voice", { method: "POST", body: form, signal: controller.signal });
        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error ?? "The demo is unavailable right now.");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let pending = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          pending += decoder.decode(value, { stream: true });
          const lines = pending.split("\n");
          pending = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as VoiceEvent;
            if (event.type === "transcript") {
              turnsRef.current = [...turnsRef.current, { role: "user", content: event.text }];
              setTurns(turnsRef.current);
            } else if (event.type === "text") {
              reply += event.delta;
              setLiveReply(reply);
            } else if (event.type === "audio") {
              enqueueAudio(event.data);
            } else if (event.type === "error") {
              setError(event.message);
            }
          }
        }

        if (reply.trim()) {
          turnsRef.current = [...turnsRef.current, { role: "assistant", content: reply.trim() }];
          setTurns(turnsRef.current);
        }
        setLiveReply("");
        await decodeChain;
        await lastEnd;
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        endCall();
        return;
      }

      if (stale()) return;
      if (turnsRef.current.length >= MAX_TURNS * 2) {
        setError("That's the end of the demo call. Book a free consultation to see one built for your business.");
        endCall();
        return;
      }
      listenRef.current();
    },
    [endCall],
  );

  const listen = useCallback(() => {
    const stream = micRef.current;
    const ctx = ctxRef.current;
    if (!stream || !ctx || !activeRef.current) return;

    const mime = pickMime();
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recorderRef.current = recorder;
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    const micSource = ctx.createMediaStreamSource(stream);
    micSource.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    const startedAt = performance.now();
    let heardSpeech = false;
    let lastSpeech = startedAt;

    const timer = window.setInterval(() => {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) sum += s * s;
      const rms = Math.sqrt(sum / samples.length);
      const now = performance.now();
      if (rms > SPEECH_RMS) {
        heardSpeech = true;
        lastSpeech = now;
      }
      const ended =
        (heardSpeech && now - lastSpeech > END_SILENCE_MS) ||
        (!heardSpeech && now - startedAt > NO_SPEECH_MS) ||
        now - startedAt > MAX_TURN_MS;
      if (ended && recorder.state === "recording") recorder.stop();
    }, 100);

    recorder.onstop = () => {
      window.clearInterval(timer);
      micSource.disconnect();
      if (!activeRef.current) return;
      if (!heardSpeech) {
        setError("Call ended because we didn't hear anything. Tap to try again.");
        endCall();
        return;
      }
      void sendTurn(new Blob(chunks, { type: recorder.mimeType || mime }));
    };

    recorder.start(250);
    setStatus("listening");
  }, [endCall, sendTurn]);

  useEffect(() => {
    listenRef.current = listen;
  }, [listen]);

  async function startCall() {
    setError(null);
    setStatus("connecting");
    try {
      ctxRef.current ??= new AudioContext();
      await ctxRef.current.resume();
      micRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      setStatus("idle");
      setError("We need microphone access to talk. Please allow the mic and try again.");
      return;
    }
    activeRef.current = true;
    turnsRef.current = [];
    setTurns([]);
    listen();
  }

  function interrupt() {
    // Tap while the agent is talking: stop it and listen.
    turnIdRef.current++;
    abortRef.current?.abort();
    stopPlayback();
    setLiveReply("");
    listen();
  }

  const inCall = status !== "idle";
  const recent = turns.slice(-4);

  return (
    <div className="flex h-full flex-col rounded-[2rem] bg-ink p-6 text-paper sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">Talk to our voice agent</h3>
        <span className="rounded-full bg-paper/10 px-3 py-1 text-xs font-medium text-paper/70">In your browser</span>
      </div>
      <p className="mt-2 text-paper/70">Speak in Telugu, Hindi, English or a mix. Ask what it can do for your business.</p>

      <div className="mt-6 flex h-20 items-center justify-center" aria-hidden="true">
        <SoundWave
          bars={20}
          className={cn(
            "transition-opacity",
            status === "speaking" || status === "listening" ? "opacity-100" : "opacity-40 [&>span]:[animation-play-state:paused]",
          )}
        />
      </div>
      <p className="mt-3 text-center text-sm font-medium text-paper/80" role="status" aria-live="polite">
        {statusLabel[status]}
      </p>

      <div className="mt-6 flex justify-center gap-3">
        {!inCall ? (
          <button
            type="button"
            onClick={startCall}
            className="inline-flex min-h-14 items-center gap-2 rounded-full bg-saffron px-7 text-lg font-semibold text-ink hover:bg-[#ffab48]"
          >
            <Mic className="h-6 w-6" aria-hidden="true" />
            Start talking
          </button>
        ) : (
          <>
            {status === "speaking" ? (
              <button
                type="button"
                onClick={interrupt}
                className="inline-flex min-h-14 items-center gap-2 rounded-full border-2 border-paper/30 px-6 font-semibold hover:border-paper/70"
              >
                <Mic className="h-5 w-5" aria-hidden="true" />
                Interrupt
              </button>
            ) : null}
            <button
              type="button"
              onClick={endCall}
              className="inline-flex min-h-14 items-center gap-2 rounded-full bg-[#e5484d] px-6 font-semibold text-white hover:bg-[#f2555a]"
            >
              {status === "connecting" ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <PhoneOff className="h-5 w-5" aria-hidden="true" />
              )}
              End call
            </button>
          </>
        )}
      </div>

      {error ? <p className="mt-4 rounded-xl bg-paper/10 px-4 py-3 text-sm text-paper/90">{error}</p> : null}

      {recent.length > 0 || liveReply ? (
        <ol className="mt-6 space-y-2 text-[15px]" aria-label="Conversation transcript">
          {recent.map((t, i) => (
            <li
              key={turns.length - recent.length + i}
              className={cn(
                "max-w-[90%] rounded-2xl px-4 py-2.5",
                t.role === "user" ? "bg-paper/10 text-paper/85" : "ml-auto bg-saffron text-ink",
              )}
            >
              {t.content}
            </li>
          ))}
          {liveReply ? <li className="ml-auto max-w-[90%] rounded-2xl bg-saffron px-4 py-2.5 text-ink">{liveReply}</li> : null}
        </ol>
      ) : null}

      <p className="mt-auto pt-6 text-xs text-paper/50">
        Uses your microphone only while the call is on. We don&rsquo;t store your recordings.
      </p>
    </div>
  );
}

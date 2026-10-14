"use client";

import { ArrowUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Message = { role: "user" | "assistant"; content: string };

const starters = [
  "What can you do for my clinic?",
  "మీరు తెలుగులో మాట్లాడగలరా?",
  "Restaurant ke liye kaise kaam karega?",
  "How long does setup take?",
];

const MAX_CHARS = 1000;

export function ChatAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError(null);
    setInput("");
    const history: Message[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The demo is unavailable right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setMessages(history.slice(0, -1));
      setInput(content);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-line bg-white">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-whatsapp" aria-hidden="true" />
        <h3 className="font-display text-lg font-bold">Chat with our agent</h3>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.length === 0 ? (
          <div>
            <p className="text-muted">Ask anything, in any language. Try one of these:</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="min-h-11 rounded-full border border-line bg-paper px-4 py-2 text-left text-[15px] hover:border-ink/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
                m.role === "user" ? "ml-auto rounded-tr-sm bg-ink text-paper" : "rounded-tl-sm bg-sand text-ink",
              )}
            >
              {m.content ||
                (busy && i === messages.length - 1 ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted" aria-label="Typing" />
                ) : null)}
            </div>
          ))
        )}
        {error ? <p className="rounded-xl bg-saffron-soft px-4 py-3 text-sm">{error}</p> : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-end gap-2 border-t border-line p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat-input"
          rows={1}
          value={input}
          maxLength={MAX_CHARS}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          placeholder="Type your message…"
          className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl bg-paper px-4 py-3 text-base outline-none focus:ring-2 focus:ring-saffron"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron text-ink disabled:opacity-40"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

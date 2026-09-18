"use client";

import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sparkles, Send, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "Which models are overstocked right now?",
  "Which cluster is growing fastest this year?",
  "Who are the top performing ASMs?",
];

export function ChatPanel({ open, onOpenChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessages([...next, { role: "assistant", content: data.text }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75vh]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-amber-300 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <SheetTitle>Ask Sales Board</SheetTitle>
          </div>
          <SheetDescription>Answers are grounded in the current dashboard data (sample data for now).</SheetDescription>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left text-sm text-text2 bg-card2 border border-cardline rounded-xl px-3.5 py-2.5 hover:bg-cardline/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-accent text-white" : "bg-card2 text-text2"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card2 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-text4 text-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
              </div>
            </div>
          )}
          {error && (
            <div className="bg-bad/15 border border-bad/25 text-badText text-xs rounded-xl px-3.5 py-2.5">{error}</div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 px-5 py-3 border-t border-cardline"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sales, stock, or models…"
            className="flex-1 text-sm bg-card2 border border-cardline rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0 hover:bg-accentText transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

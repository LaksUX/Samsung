"use client";

import { useState } from "react";
import { Radio, Sparkles, CalendarDays, Smartphone, LayoutGrid, MapPinned, Users } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { DayWiseView } from "@/components/views/DayWiseView";
import { ModelWiseView } from "@/components/views/ModelWiseView";
import { CategoryWiseView } from "@/components/views/CategoryWiseView";
import { ClusterWiseView } from "@/components/views/ClusterWiseView";
import { AsmWiseView } from "@/components/views/AsmWiseView";

const VIEWS = [
  { key: "day", label: "Day", icon: CalendarDays, Component: DayWiseView },
  { key: "model", label: "Model", icon: Smartphone, Component: ModelWiseView },
  { key: "category", label: "Category", icon: LayoutGrid, Component: CategoryWiseView },
  { key: "cluster", label: "Cluster", icon: MapPinned, Component: ClusterWiseView },
  { key: "asm", label: "ASM", icon: Users, Component: AsmWiseView },
];

export default function Dashboard() {
  const [view, setView] = useState("model");
  const [chatOpen, setChatOpen] = useState(false);
  const Active = VIEWS.find((v) => v.key === view).Component;

  return (
    <main className="min-h-screen flex justify-center pb-24">
      <div className="w-full max-w-md px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-[19px] h-[19px] text-ink" strokeWidth={2} />
            <span className="font-display font-semibold text-[19px] tracking-tight">Sales Board</span>
          </div>
          <div className="text-right text-[13px] text-text4 leading-tight">
            <div className="text-ink font-semibold">Samsung</div>
            <div>Karnataka</div>
          </div>
        </div>

        {/* View switcher */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: "none" }}>
          {VIEWS.map((v) => {
            const Icon = v.icon;
            const active = v.key === view;
            return (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wide px-3.5 py-2.5 rounded-xl border transition-colors ${
                  active ? "bg-accent text-white border-accent" : "bg-card border-cardline text-text3"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {v.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        <Active />

        <div className="text-center pt-6 pb-2">
          <span className="font-mono text-[11.5px] text-text4 tracking-wide">
            REAL DATA · REPORT AS ON 15-SEP-2026 · SAMSUNG KARNATAKA
          </span>
        </div>
      </div>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white shadow-lg shadow-accent/30 flex items-center justify-center hover:bg-accentText hover:scale-105 active:scale-95 transition-all z-40"
        aria-label="Ask Sales Board"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      <ChatPanel open={chatOpen} onOpenChange={setChatOpen} />
    </main>
  );
}

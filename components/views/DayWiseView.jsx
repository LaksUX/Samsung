"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DATA as DAY } from "@/lib/real-data/day_wise";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function DayWiseView() {
  const [metric, setMetric] = useState("value");
  const block = metric === "value" ? DAY.value : DAY.volume;
  const isValue = metric === "value";
  const fmt = (n) => (n === null || n === undefined ? "—" : isValue ? n.toFixed(1) : Math.round(n).toLocaleString("en-IN"));
  const fmtBig = (n) => (isValue ? `₹${n.toFixed(1)} Cr` : Math.round(n).toLocaleString("en-IN"));

  const delta = ((block.ytd - block.lytd) / block.lytd) * 100;

  const chartData = useMemo(() => MONTHS.map((m) => ({
    month: m,
    y2025: block.mtd2025[m],
    y2026: block.mtd2026[m],
  })), [metric]);
  const max = Math.max(...chartData.flatMap((d) => [d.y2025 || 0, d.y2026 || 0]));

  return (
    <div>
      <Tabs value={metric} onValueChange={setMetric} className="mb-5">
        <TabsList>
          <TabsTrigger value="value">VALUE (₹ CR)</TabsTrigger>
          <TabsTrigger value="volume">VOLUME (UNITS)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-gradient-to-br from-card to-card2 border border-cardline rounded-2xl p-5 mb-[18px] shadow-sm">
        <div className="text-[12.5px] text-text3 font-medium mb-2 tracking-wide">
          YTD (THROUGH 15-SEP-2026) · {isValue ? "VALUE" : "VOLUME"}
        </div>
        <div className="font-mono font-semibold text-[32px] leading-tight tabular">{fmtBig(block.ytd)}</div>
        <div className="flex items-center gap-3 mt-3">
          <div className={`flex items-center gap-1 font-mono font-semibold text-sm ${delta >= 0 ? "text-goodText" : "text-badText"}`}>
            {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(delta).toFixed(1)}%
          </div>
          <span className="text-[12.5px] text-text4">vs {fmtBig(block.lytd)} same period (LYTD) 2025</span>
        </div>
      </div>

      <Card className="mb-[18px]">
        <CardHeader>
          <CardTitle>Monthly · 2025 vs 2026</CardTitle>
          <CardDescription>2026 shown through mid-September; remaining months pending</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex gap-3 text-[10px] text-text4 font-mono mb-3">
            <span><span className="text-cardline2">■</span> 2025</span>
            <span><span className="text-accent">■</span> 2026</span>
          </div>
          {chartData.map((d) => (
            <div key={d.month} className="flex items-center gap-2 mb-2">
              <div className="w-9 text-[11px] text-text3 font-medium flex-shrink-0">{d.month}</div>
              <div className="flex-1 space-y-1">
                <div className="h-[9px] bg-card2 rounded overflow-hidden">
                  <div className="h-full bg-cardline2 rounded" style={{ width: `${((d.y2025 || 0) / max) * 100}%` }} />
                </div>
                <div className="h-[9px] bg-card2 rounded overflow-hidden">
                  <div className="h-full bg-accent rounded" style={{ width: `${((d.y2026 || 0) / max) * 100}%` }} />
                </div>
              </div>
              <div className="w-16 text-right font-mono text-[11px] text-text3 tabular flex-shrink-0">
                {d.y2026 !== null && d.y2026 !== undefined ? fmt(d.y2026) : "—"}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Full year 2025</CardTitle>
          <CardDescription>For reference — complete calendar year</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="font-mono font-semibold text-xl tabular">{fmtBig(block.fullYear2025)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

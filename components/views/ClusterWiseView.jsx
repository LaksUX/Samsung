"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DATA as CLUSTER } from "@/lib/real-data/cluster_wise";

const fmtCr = (n) => (n === null || n === undefined ? "—" : `₹${n.toFixed(1)} Cr`);
const fmtInt = (n) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-IN"));

export function ClusterWiseView() {
  const [metric, setMetric] = useState("value");
  const isValue = metric === "value";
  const block = isValue ? CLUSTER.value : CLUSTER.quantity;

  const ytdByCluster = useMemo(() => {
    return CLUSTER.clusters
      .map((c) => ({ name: c, y2025: block.y2025Total[c], y2026: block.y2026Total[c] }))
      .sort((a, b) => (b.y2026 || 0) - (a.y2026 || 0));
  }, [metric]);
  const max = Math.max(...ytdByCluster.map((c) => c.y2026 || 0), 1);

  const grandTotal2026 = CLUSTER.clusters.reduce((s, c) => s + (block.y2026Total[c] || 0), 0);
  const grandTotal2025 = CLUSTER.clusters.reduce((s, c) => s + (block.y2025Total[c] || 0), 0);
  const delta = ((grandTotal2026 - grandTotal2025) / grandTotal2025) * 100;

  const fmt = isValue ? fmtCr : fmtInt;

  return (
    <div>
      <Tabs value={metric} onValueChange={setMetric} className="mb-5">
        <TabsList>
          <TabsTrigger value="value">VALUE (₹ CR)</TabsTrigger>
          <TabsTrigger value="volume">VOLUME (UNITS)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-gradient-to-br from-card to-card2 border border-cardline rounded-2xl p-5 mb-[18px] shadow-sm">
        <div className="text-[12.5px] text-text3 font-medium mb-2 tracking-wide">2026 YTD (JAN–SEP) · ALL CLUSTERS</div>
        <div className="font-mono font-semibold text-[28px] leading-tight tabular">{fmt(grandTotal2026)}</div>
        <div className="flex items-center gap-3 mt-3">
          <span className={`font-mono font-semibold text-sm ${delta >= 0 ? "text-goodText" : "text-badText"}`}>
            {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
          </span>
          <span className="text-[12.5px] text-text4">vs {fmt(grandTotal2025)} same period 2025</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By cluster · Jan–Sep YTD</CardTitle>
          <CardDescription>Ranked by 2026, compared to same-period 2025</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {ytdByCluster.map((c) => (
            <div key={c.name} className="mb-3.5">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-text2 font-semibold">{c.name}</span>
                <span className="font-mono tabular">{fmt(c.y2026)}</span>
              </div>
              <div className="relative h-[9px] bg-card2 rounded-full overflow-hidden">
                <div className="absolute h-full bg-cardline2 rounded-full" style={{ width: `${((c.y2025 || 0) / max) * 100}%` }} />
                <div className="absolute h-full bg-accent rounded-full opacity-80" style={{ width: `${((c.y2026 || 0) / max) * 100}%` }} />
              </div>
            </div>
          ))}
          <div className="flex gap-3 text-[10px] text-text4 font-mono pt-1">
            <span><span className="text-cardline2">■</span> 2025</span>
            <span><span className="text-accent">■</span> 2026</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

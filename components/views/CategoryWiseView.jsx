"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DATA as CAT } from "@/lib/real-data/category_wise";

const fmtCr = (n) => (n === null || n === undefined ? "—" : `₹${n.toFixed(1)} Cr`);
const fmtInt = (n) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-IN"));
const pct = (n) => (n === null || n === undefined ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`);

const CLUSTER_OPTIONS = ["Karnataka", ...Object.keys(CAT.clusters)];

export function CategoryWiseView() {
  const [scope, setScope] = useState("Karnataka");
  const [metric, setMetric] = useState("value");
  const isValue = metric === "value";

  const categories = scope === "Karnataka" ? CAT.karnataka : CAT.clusters[scope];
  const filtered = categories.filter((c) => c.name.trim() !== "Total");
  const max = Math.max(...filtered.map((c) => (isValue ? c.value.mtd : c.volume.mtd) || 0), 1);

  return (
    <div>
      <div className="mb-4">
        <div className="text-xs text-text4 font-medium mb-2 tracking-wide">SCOPE</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CLUSTER_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setScope(c)}
              className={`flex-shrink-0 font-mono text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                scope === c ? "bg-accent text-white border-accent" : "bg-card border-cardline2 text-text3"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Tabs value={metric} onValueChange={setMetric} className="mb-5">
        <TabsList>
          <TabsTrigger value="value">VALUE (₹ CR)</TabsTrigger>
          <TabsTrigger value="volume">VOLUME ('000)</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-[18px]">
        <CardHeader>
          <CardTitle>{scope} · MTD by category</CardTitle>
          <CardDescription>vs LYMTD (15-Sep-2025)</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {filtered.map((c) => {
            const block = isValue ? c.value : c.volume;
            return (
              <div key={c.name} className="mb-3.5">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[13px] text-text2 font-semibold">{c.name.trim()}</span>
                  <div className="flex items-center gap-2">
                    {block.flagged && <TriangleAlert className="w-3.5 h-3.5 text-accentText" />}
                    <span className="font-mono text-[13px] tabular">
                      {block.flagged ? "data error in source" : isValue ? fmtCr(block.mtd) : fmtInt(block.mtd)}
                    </span>
                    <span className={`font-mono text-[11px] ${block.grwMtd >= 0 ? "text-goodText" : "text-badText"}`}>
                      {pct(block.grwMtd)}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-card2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                    style={{ width: block.flagged ? "0%" : `${Math.max(2, ((block.mtd || 0) / max) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="mt-2 flex gap-2 bg-accent/10 border border-accent/25 rounded-lg px-3 py-2">
            <TriangleAlert className="w-3.5 h-3.5 text-accentText flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-text2 leading-relaxed m-0">
              "N Perfomance" Value YTD shows ₹529 Cr identically across every cluster in the source file —
              a broken formula reference, not real data. Excluded here; worth checking the original workbook.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

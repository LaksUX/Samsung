"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModelDetailSheet } from "@/components/model-detail-sheet";
import { DATA as MW } from "@/lib/real-data/model_wise";

const fmtInt = (n) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-IN"));
const fmtCr = (n) => (n === null || n === undefined ? "—" : `₹${n.toFixed(1)} Cr`);
const pct = (n) => (n === null || n === undefined ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`);

export function ModelWiseView() {
  const [breakdown, setBreakdown] = useState("priceband");
  const [selectedModel, setSelectedModel] = useState(null);

  const grandVol = MW.priceBand.grandTotalVolume;
  const grandVal = MW.priceBand.grandTotalValue;

  const funnelStages = [
    { label: "Sell In", val: MW.totals.total.sellIn.mtd, color: "#71717a" },
    { label: "Sell Out", val: MW.totals.total.sellOut.mtd, color: "#ff8a34" },
    { label: "Secondary", val: MW.totals.total.secondary.mtd, color: "#2fd3a0" },
  ];
  const funnelMax = funnelStages[0].val || 1;

  const segmentTotals = useMemo(() => {
    const totals = {};
    const order = [];
    MW.models.forEach((m) => {
      if (!order.includes(m.segment)) order.push(m.segment);
      totals[m.segment] = (totals[m.segment] || 0) + (m.sellOut.mtd || 0);
    });
    return order.map((s) => [s, totals[s]]);
  }, []);
  const segMax = Math.max(...segmentTotals.map((s) => s[1]), 1);

  const wod = MW.totals.total;

  const topModels = useMemo(() =>
    [...MW.models].sort((a, b) => (b.sellOut.mtd || 0) - (a.sellOut.mtd || 0)).slice(0, 10),
  []);

  const wodTone = (w) => (w === null ? "default" : w < 2 ? "risk" : w <= 6 ? "healthy" : "watch");
  const wodLabel = (w) => (w === null ? "N/A" : w < 2 ? "LOW" : w <= 6 ? "HEALTHY" : "EXCESS");

  return (
    <div>
      <div className="bg-gradient-to-br from-card to-card2 border border-cardline rounded-2xl p-5 mb-[18px] shadow-sm">
        <div className="text-[12.5px] text-text3 font-medium mb-2 tracking-wide">SELL OUT · MTD</div>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="font-mono font-semibold text-[28px] leading-tight tabular">{fmtCr(grandVal.mtd)}</div>
          <div className="font-mono text-sm text-text4 tabular pb-1">{fmtInt(grandVol.mtd)} units</div>
        </div>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className={`flex items-center gap-1 font-mono font-semibold text-sm ${grandVal.grw >= 0 ? "text-goodText" : "text-badText"}`}>
            {grandVal.grw >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {pct(grandVal.grw)} value
          </div>
          <div className={`flex items-center gap-1 font-mono text-sm ${grandVol.grw >= 0 ? "text-goodText" : "text-badText"}`}>
            {pct(grandVol.grw)} volume
          </div>
          <span className="text-[12.5px] text-text4">vs LMTD</span>
        </div>
      </div>

      <Card className="mb-[18px]">
        <CardHeader>
          <CardTitle>Sell-through funnel</CardTitle>
          <CardDescription>Volume (units) · Sell In → Sell Out → Secondary</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {funnelStages.map((s, i) => (
            <div key={s.label}>
              <div className="flex items-center gap-2">
                <div className="w-[72px] text-[12.5px] text-text3 font-medium flex-shrink-0">{s.label}</div>
                <div className="flex-1 h-7 bg-card2 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center pl-2.5 font-mono text-xs font-semibold text-white tabular transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(2, (Math.abs(s.val) / funnelMax) * 100)}%`, backgroundColor: s.color }}
                  >
                    {fmtInt(s.val)}
                  </div>
                </div>
              </div>
              {i < funnelStages.length - 1 && (
                <div className="text-center font-mono text-[11px] text-text4 my-[3px]" style={{ marginLeft: 80 }}>
                  ↓ {funnelStages[i + 1].val && s.val ? ((funnelStages[i + 1].val / s.val) * 100).toFixed(0) : "—"}% converts through
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-[18px]">
        <CardHeader>
          <CardTitle>By segment</CardTitle>
          <CardDescription>Sell Out MTD volume (units) · exact sheet labels</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {segmentTotals.map(([name, val]) => (
            <div key={name} className="flex items-center gap-2.5 mb-[9px]">
              <div className="w-[100px] text-xs text-text3 font-medium text-right flex-shrink-0">{name}</div>
              <div className="flex-1 h-[15px] bg-card2 rounded-r overflow-hidden">
                <div className="h-full bg-accent rounded-r transition-all duration-500 ease-out" style={{ width: `${Math.max(2, (Math.abs(val) / segMax) * 100)}%` }} />
              </div>
              <div className="w-14 text-right font-mono text-[11px] text-text3 tabular flex-shrink-0">{fmtInt(val)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-[18px]">
        <CardHeader><CardTitle>Breakdown</CardTitle></CardHeader>
        <CardContent className="pt-3">
          <Tabs value={breakdown} onValueChange={setBreakdown} className="mb-4">
            <TabsList>
              <TabsTrigger value="priceband">PRICE BAND</TabsTrigger>
              <TabsTrigger value="category">CATEGORY</TabsTrigger>
            </TabsList>
          </Tabs>
          {breakdown === "priceband" ? (
            <div className="flex gap-3">
              <div className="flex-1 bg-card2 border border-cardline rounded-2xl p-[15px]">
                <div className="text-xs text-text4 font-medium mb-2">Above ₹40K</div>
                <div className="font-mono font-semibold text-[17px] tabular">{fmtCr(MW.priceBand.above40k.value.mtd)}</div>
                <div className="text-[11px] text-text4 mt-1">{fmtInt(MW.priceBand.above40k.volume.mtd)} units</div>
              </div>
              <div className="flex-1 bg-card2 border border-cardline rounded-2xl p-[15px]">
                <div className="text-xs text-text4 font-medium mb-2">Below ₹40K</div>
                <div className="font-mono font-semibold text-[17px] tabular">{fmtCr(MW.priceBand.below40k.value.mtd)}</div>
                <div className="text-[11px] text-text4 mt-1">{fmtInt(MW.priceBand.below40k.volume.mtd)} units</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {["flagship", "innovative", "gear", "tab"].map((key) => {
                const cat = MW.category[key];
                const max = Math.max(...["flagship","innovative","gear","tab"].map((k) => MW.category[k].value.mtd || 0), 1);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-[13px] mb-1.5">
                      <span className="text-text2 font-semibold capitalize">{key}</span>
                      <span className="font-mono tabular">{fmtCr(cat.value.mtd)}</span>
                    </div>
                    <div className="h-2 bg-card2 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.max(2, ((cat.value.mtd || 0) / max) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-[18px]">
        <CardHeader><CardTitle>Weeks of Demand (WOD)</CardTitle></CardHeader>
        <CardContent className="pt-3">
          <div className="flex gap-2 bg-accent/10 border border-accent/25 rounded-[10px] px-[11px] py-[10px] mb-[14px]">
            <TriangleAlert className="w-[15px] h-[15px] text-accentText flex-shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-text2 leading-relaxed m-0">
              Bands (Low / Healthy / Excess) are illustrative — confirm real cutoffs with your team.
              Figures below are portfolio-wide totals from the sheet.
            </p>
          </div>
          {[["Stock WOD", wod.stockWOD], ["Sellin WOD", wod.sellinWOD], ["Sellout WOD", wod.selloutWOD]].map(([name, w], i, arr) => (
            <div key={name}>
              <div className="flex items-center justify-between py-[11px]">
                <span className="text-sm text-text2 font-medium">{name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] text-text3 font-medium tabular">{w} wks</span>
                  <Badge variant={wodTone(w)}>{wodLabel(w)}</Badge>
                </div>
              </div>
              {i < arr.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top models · Sell Out MTD (units)</CardTitle>
          <CardDescription>Tap a model for its full breakdown</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {topModels.map((d, i) => (
            <div key={d.model}>
              <button
                onClick={() => setSelectedModel(d)}
                className="flex items-center gap-[11px] py-[11px] w-full text-left hover:bg-card2 -mx-1 px-1 rounded-lg transition-colors"
              >
                <span className="w-5 font-mono text-[11.5px] text-text4 font-medium">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink font-semibold truncate">{d.model}</div>
                  <div className="text-[11.5px] text-text4 mt-0.5">{d.segment}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium tabular">{fmtInt(d.sellOut.mtd)}</div>
                  <div className={`font-mono text-[11.5px] font-semibold mt-0.5 ${d.sellOut.grw >= 0 ? "text-goodText" : "text-badText"}`}>
                    {pct(d.sellOut.grw)}
                  </div>
                </div>
              </button>
              {i < topModels.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <ModelDetailSheet model={selectedModel} open={!!selectedModel} onOpenChange={(v) => !v && setSelectedModel(null)} />
    </div>
  );
}

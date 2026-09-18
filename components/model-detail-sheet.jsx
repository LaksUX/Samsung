"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const fmtInt = (n) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-IN"));
const pct = (n) => (n === null || n === undefined ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`);

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 text-sm">
      <span className="text-text3">{label}</span>
      <span className="font-mono font-medium text-ink tabular">{value}</span>
    </div>
  );
}

export function ModelDetailSheet({ model, open, onOpenChange }) {
  if (!model) return null;
  const wodTone = (w) => (w === null || w === undefined ? "default" : w < 2 ? "risk" : w <= 6 ? "healthy" : "watch");
  const wodLabel = (w) => (w === null || w === undefined ? "N/A" : w < 2 ? "LOW" : w <= 6 ? "HEALTHY" : "EXCESS");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>{model.model}</SheetTitle>
          <SheetDescription>{model.segment} · Volume (units), MTD vs LMTD</SheetDescription>
        </SheetHeader>
        <div className="px-5 pb-6 overflow-y-auto">
          <div className="text-xs text-text4 font-medium tracking-wide mt-1 mb-1">FUNNEL (MTD)</div>
          <Row label="Sell In" value={`${fmtInt(model.sellIn.mtd)} units · ${pct(model.sellIn.grw)}`} />
          <Separator />
          <Row label="Sell Out" value={`${fmtInt(model.sellOut.mtd)} units · ${pct(model.sellOut.grw)}`} />
          <Separator />
          <Row label="Secondary" value={`${fmtInt(model.secondary.mtd)} units · ${pct(model.secondary.grw)}`} />

          <div className="text-xs text-text4 font-medium tracking-wide mt-5 mb-1">STOCK & DOS</div>
          <Row label="SPD" value={`${fmtInt(model.stockSPD)} units · ${fmtInt(model.dosSPD)}d DOS`} />
          <Separator />
          <Row label="MDD" value={`${fmtInt(model.stockMDD)} units · ${fmtInt(model.dosMDD)}d DOS`} />
          <Separator />
          <Row label="Dealer" value={`${fmtInt(model.stockDealer)} units · ${fmtInt(model.dosDealer)}d DOS`} />

          {model.adsTarget !== null && (
            <>
              <div className="text-xs text-text4 font-medium tracking-wide mt-5 mb-1">TARGET</div>
              <Row label="ADS (Sep'26)" value={`${fmtInt(model.adsTarget)} units/day`} />
            </>
          )}

          <div className="text-xs text-text4 font-medium tracking-wide mt-5 mb-2">WEEKS OF DEMAND</div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={wodTone(model.stockWOD)}>Stock {model.stockWOD ?? "—"}w · {wodLabel(model.stockWOD)}</Badge>
            <Badge variant={wodTone(model.sellinWOD)}>Sell In {model.sellinWOD ?? "—"}w · {wodLabel(model.sellinWOD)}</Badge>
            <Badge variant={wodTone(model.selloutWOD)}>Sell Out {model.selloutWOD ?? "—"}w · {wodLabel(model.selloutWOD)}</Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

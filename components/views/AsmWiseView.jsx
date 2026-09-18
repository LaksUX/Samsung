"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DATA as ASM } from "@/lib/real-data/asm_wise";

const fmtCr = (n) => (n === null || n === undefined ? "—" : `₹${n.toFixed(2)} Cr`);
const fmtInt = (n) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-IN"));
const pct = (n) => (n === null || n === undefined ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`);

function PerfRow({ row, bold }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${bold ? "bg-card2 -mx-4 px-4 rounded-lg" : ""}`}>
      <span className={`text-[13px] ${bold ? "text-ink font-semibold" : "text-text2"}`}>{row.name}</span>
      <div className="text-right">
        <div className="font-mono text-[13px] tabular">{fmtCr(row.value.ytd)}</div>
        <div className={`font-mono text-[10.5px] ${row.value.grw >= 0 ? "text-goodText" : "text-badText"}`}>
          {pct(row.value.grw)} YTD
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { key: "asm", label: "ASM" },
  { key: "mdd", label: "MDD Distributors" },
  { key: "mix", label: "Channel & Price" },
];

export function AsmWiseView() {
  const [tab, setTab] = useState("asm");

  return (
    <div>
      <div className="flex gap-1 p-1 rounded-[10px] border border-cardline2 bg-card2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 font-mono text-[11px] font-medium tracking-wide py-2 rounded-[7px] transition-colors ${
              tab === t.key ? "bg-accent text-white" : "text-text3"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-card to-card2 border border-cardline rounded-2xl p-5 mb-[18px] shadow-sm">
        <div className="text-[12.5px] text-text3 font-medium mb-2 tracking-wide">GRAND TOTAL · YTD</div>
        <div className="font-mono font-semibold text-[28px] leading-tight tabular">{fmtCr(ASM.grandTotal.value.ytd)}</div>
        <div className="flex items-center gap-3 mt-3">
          <span className={`font-mono font-semibold text-sm ${ASM.grandTotal.value.grw >= 0 ? "text-goodText" : "text-badText"}`}>
            {pct(ASM.grandTotal.value.grw)}
          </span>
          <span className="text-[12.5px] text-text4">vs {fmtCr(ASM.grandTotal.value.lytd)} LYTD</span>
        </div>
      </div>

      {tab === "asm" && (
        <Card>
          <CardHeader>
            <CardTitle>ASM performance</CardTitle>
            <CardDescription>Real names — team totals highlighted</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            {ASM.asmList.map((row, i) => (
              <div key={row.name + i}>
                <PerfRow row={row} bold={row.isSubtotal} />
                {i < ASM.asmList.length - 1 && !row.isSubtotal && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "mdd" && (
        <div className="space-y-[18px]">
          {Object.entries(ASM.mddByCluster).map(([cluster, rows]) => (
            <Card key={cluster}>
              <CardHeader>
                <CardTitle>{cluster} MDDs</CardTitle>
                <CardDescription>{rows.length} distributor accounts</CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                {rows.map((row, i) => (
                  <div key={row.name + i}>
                    <PerfRow row={row} />
                    {i < rows.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "mix" && (
        <div className="space-y-[18px]">
          <Card>
            <CardHeader>
              <CardTitle>By channel</CardTitle>
              <CardDescription>RCM EXC, PC, SCP, retail formats — no individual names</CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              {ASM.channel.map((row, i) => (
                <div key={row.name}>
                  <PerfRow row={row} />
                  {i < ASM.channel.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>By price class</CardTitle>
              <CardDescription>Sell-out value by price tier</CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              {ASM.priceClass.map((row, i) => (
                <div key={row.name}>
                  <PerfRow row={row} />
                  {i < ASM.priceClass.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

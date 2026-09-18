import { DATA as DAY } from "@/lib/real-data/day_wise";
import { DATA as MW } from "@/lib/real-data/model_wise";
import { DATA as CAT } from "@/lib/real-data/category_wise";
import { DATA as CLUSTER } from "@/lib/real-data/cluster_wise";
import { DATA as ASM } from "@/lib/real-data/asm_wise";

export function getDataSummary() {
  const topModels = [...MW.models]
    .sort((a, b) => (b.sellOut.mtd || 0) - (a.sellOut.mtd || 0))
    .slice(0, 10)
    .map((m, i) => `  ${i + 1}. ${m.model} (${m.segment}) — Sell Out ${m.sellOut.mtd} units MTD, ${m.sellOut.grw >= 0 ? "+" : ""}${m.sellOut.grw}% vs LMTD, Stock WOD ${m.stockWOD}wks`)
    .join("\n");

  const clusterLines = CLUSTER.clusters
    .map((c) => `  - ${c}: ₹${CLUSTER.value.y2026Total[c]?.toFixed(1)} Cr YTD 2026 (vs ₹${CLUSTER.value.y2025Total[c]?.toFixed(1)} Cr same period 2025)`)
    .join("\n");

  const categoryLines = CAT.karnataka
    .filter((c) => c.name.trim() !== "Total")
    .map((c) => `  - ${c.name.trim()}: ₹${c.value.mtd ?? "N/A"} Cr Sell Out MTD, ${c.value.grwMtd >= 0 ? "+" : ""}${c.value.grwMtd}%`)
    .join("\n");

  const topAsms = ASM.asmList
    .filter((a) => !a.isSubtotal)
    .sort((a, b) => (b.value.ytd || 0) - (a.value.ytd || 0))
    .slice(0, 5)
    .map((a) => `  - ${a.name}: ₹${a.value.ytd} Cr YTD, ${a.value.grw >= 0 ? "+" : ""}${a.value.grw}%`)
    .join("\n");

  return `
=== DAY WISE (Karnataka overall) ===
YTD 2026 (through 15-Sep): ₹${DAY.value.ytd} Cr, vs ₹${DAY.value.lytd} Cr same period 2025 (${DAY.value.grw}% growth)
Volume YTD 2026: ${DAY.volume.ytd} units vs ${DAY.volume.lytd} units LY (${DAY.volume.grw}% growth)
Full year 2025 total: ₹${DAY.value.fullYear2025} Cr

=== MODEL WISE ===
Total Sell Out MTD: ${MW.priceBand.grandTotalVolume.mtd} units, ₹${MW.priceBand.grandTotalValue.mtd} Cr
Above ₹40K: ₹${MW.priceBand.above40k.value.mtd} Cr | Below ₹40K: ₹${MW.priceBand.below40k.value.mtd} Cr
Portfolio WOD: Stock ${MW.totals.total.stockWOD}wks, Sell In ${MW.totals.total.sellinWOD}wks, Sell Out ${MW.totals.total.selloutWOD}wks

Top 10 models by Sell Out MTD (volume, units):
${topModels}

=== CATEGORY WISE (Karnataka) ===
${categoryLines}
Note: "N Perfomance" Value YTD is a known broken formula in the source (shows ₹529 Cr everywhere) — treat as unavailable.

=== CLUSTER WISE ===
${clusterLines}

=== ASM WISE (real names) ===
Grand Total YTD: ₹${ASM.grandTotal.value.ytd} Cr (${ASM.grandTotal.value.grw >= 0 ? "+" : ""}${ASM.grandTotal.value.grw}% vs LYTD)
Top 5 ASMs by YTD value:
${topAsms}

Report as on: 15-Sep-2026. All figures from the actual Samsung Karnataka distribution sheets (Day Wise, Model Wise, Category Wise, Cluster Wise, MDD/ASM Wise).
`.trim();
}

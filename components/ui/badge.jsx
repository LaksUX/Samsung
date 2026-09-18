import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-wide",
  {
    variants: {
      variant: {
        healthy: "bg-good/15 text-goodText border-good/30",
        watch: "bg-accent/15 text-accentText border-accent/30",
        risk: "bg-bad/15 text-badText border-bad/30",
        default: "bg-card2 text-text3 border-cardline2",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

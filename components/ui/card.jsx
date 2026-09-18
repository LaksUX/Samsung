import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-cardline bg-card shadow-sm", className)}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1 p-4 pb-0", className)} {...props} />;
}
export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-display font-semibold text-[15px] leading-none text-ink", className)}
      {...props}
    />
  );
}
export function CardDescription({ className, ...props }) {
  return <p className={cn("text-[12.5px] text-text4 leading-snug", className)} {...props} />;
}
export function CardContent({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}

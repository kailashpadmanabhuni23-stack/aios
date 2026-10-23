import { cn } from "@/lib/utils"

/**
 * AIOS wordmark — typographic brand lockup.
 */
export function BsWealthLockup({
  className,
  size = "md",
}: {
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const scale = {
    sm: { mono: "text-lg", rule: "w-6 my-1", desc: "text-[7px] tracking-[0.28em]" },
    md: { mono: "text-2xl", rule: "w-9 my-1.5", desc: "text-[8px] tracking-[0.3em]" },
    lg: { mono: "text-4xl", rule: "w-14 my-2", desc: "text-[10px] tracking-[0.32em]" },
  }[size]

  return (
    <div className={cn("flex flex-col items-center leading-none select-none", className)}>
      <span className={cn("font-display font-semibold text-foreground tracking-wide", scale.mono)}>AIOS</span>
      <span className={cn("h-px bg-primary/60", scale.rule)} aria-hidden />
      <span className={cn("font-medium text-muted-foreground uppercase", scale.desc)}>
        AI Operating System
      </span>
    </div>
  )
}

/**
 * The primary lockup for sidebar and headers.
 */
export function BsWealthLockupInline({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col leading-none select-none", className)}>
      <span className="font-display text-[28px] font-bold leading-none tracking-[0.04em] text-primary">
        AIOS
      </span>
      <span className="mt-2 text-[9px] font-semibold leading-none tracking-[0.25em] text-sidebar-foreground/80 uppercase">
        AI Operating System
      </span>
    </div>
  )
}

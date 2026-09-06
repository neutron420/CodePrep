import { cn } from "@/lib/utils";

export function ProblemCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 flex flex-col justify-between space-y-3 shadow-2xs animate-pulse",
        className
      )}
    >
      <div className="space-y-3">
        {/* Card Header: Platform badge + Recency / Difficulty + Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-16 rounded-md bg-muted/80" />
            <div className="h-4 w-20 rounded bg-muted/60" />
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-5 w-14 rounded-md bg-muted/80" />
            <div className="size-6.5 rounded-md bg-muted/50" />
          </div>
        </div>

        {/* Title: 2 lines */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-3.5 w-1/2 rounded bg-muted/70" />
        </div>

        {/* Topic Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <div className="h-5 w-16 rounded-md bg-muted/70" />
          <div className="h-5 w-20 rounded-md bg-muted/70" />
          <div className="h-5 w-14 rounded-md bg-muted/70" />
        </div>
      </div>

      {/* Card Footer: Company attribution & Solve action */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <div className="size-5 rounded-md bg-muted" />
          <div className="h-3 w-20 rounded bg-muted/80" />
        </div>
        <div className="h-4 w-12 rounded bg-muted/70" />
      </div>
    </div>
  );
}

/**
 * Content placeholder while the session loads. Sidebar and header are already
 * on screen, so only this area waits. It has the page's shape: one block of
 * rows between hairlines.
 */
export function DashboardSkeleton() {
  return (
    <div className="sheet sheet--flush" aria-busy="true">
      <p role="status" className="sr-only">
        Loading your dashboard…
      </p>
      <div className="cell space-y-4 py-6 md:py-8" aria-hidden>
        <div className="h-4 w-24 animate-pulse bg-[var(--border)]" />
        <div className="h-36 animate-pulse border-y border-[var(--border)] bg-[var(--subtle)]" />
      </div>
    </div>
  );
}

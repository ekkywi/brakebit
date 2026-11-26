/**
 * Content placeholder while the session loads. Sidebar and header are already
 * on screen, so only this area waits. It has the sheet's shape: a title row,
 * then one hairline-bounded block.
 */
export function DashboardSkeleton() {
  return (
    <div className="sheet sheet--flush" aria-busy="true">
      <p role="status" className="sr-only">
        Loading your dashboard…
      </p>
      <div className="cell space-y-4 pb-6 pt-8 md:pb-8 md:pt-10" aria-hidden>
        <div className="h-3 w-56 max-w-full animate-pulse bg-[var(--border)]" />
        <div className="h-10 w-64 max-w-full animate-pulse bg-[var(--border)]" />
      </div>
      <div
        className="h-56 animate-pulse border-t border-[var(--border)] bg-[var(--subtle)]"
        aria-hidden
      />
    </div>
  );
}

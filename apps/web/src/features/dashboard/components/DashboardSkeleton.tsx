/**
 * Content placeholder while the session loads. Sidebar and header are already
 * on screen, so only this area waits.
 */
export function DashboardSkeleton() {
  return (
    <div className="max-w-4xl space-y-8" aria-busy="true">
      <p role="status" className="sr-only">
        Loading your dashboard…
      </p>
      <div className="space-y-3" aria-hidden>
        <div className="h-7 w-44 animate-pulse rounded bg-[var(--border)]" />
        <div className="h-3 w-72 max-w-full animate-pulse rounded bg-[var(--border)]" />
      </div>
      <div
        className="card h-48 animate-pulse bg-[var(--subtle)]"
        aria-hidden
      />
      <div className="space-y-3" aria-hidden>
        <div className="h-4 w-52 animate-pulse rounded bg-[var(--border)]" />
        <div className="h-3 w-full max-w-md animate-pulse rounded bg-[var(--border)]" />
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[60dvh] flex-col items-start justify-center gap-4 py-16">
      <p className="font-mono-ui text-xs text-[var(--muted)]">404</p>
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--fg)]">
        This page does not exist
      </h1>
      <Link href="/" className="btn btn-secondary btn-sm min-h-11">
        Back to home
      </Link>
    </section>
  );
}

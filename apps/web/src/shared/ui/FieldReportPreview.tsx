/**
 * Landing sample report. Figures are illustrative only.
 */
export function FieldReportPreview() {
  const signals = [
    ["Supply control", "Active", "var(--warn)"],
    ["Transfer restrictions", "Clear", "var(--ok)"],
    ["Liquidity posture", "Partial lock", "var(--warn)"],
    ["Top holder share", "24%", "var(--warn)"],
  ];

  return (
    <aside
      aria-label="Illustrative example of a Brakebit risk report"
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
        <p className="text-xs text-[var(--muted)]">Example report</p>
        <p className="font-mono-ui text-xs text-[var(--muted)]">Ethereum</p>
      </div>

      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="instrument-face p-6">
          <p className="text-xs text-white/55">Risk score</p>
          <p className="mt-2 text-6xl font-semibold leading-none tracking-[-0.04em] text-[#F0C36A]">
            58
          </p>
          <p className="mt-4 text-sm font-medium text-[#F0C36A]">
            Moderate risk
          </p>
          <div className="score-bar mt-3">
            <span className="w-[58%] bg-[#F0C36A]" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Supply control is still active and liquidity is only partly locked.
          </p>
        </div>

        <ul className="divide-y divide-[var(--border)]">
          {signals.map(([label, value, color]) => (
            <li
              key={label}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <span className="text-sm text-[var(--ink-soft)]">{label}</span>
              <span className="font-mono-ui text-sm" style={{ color }}>
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

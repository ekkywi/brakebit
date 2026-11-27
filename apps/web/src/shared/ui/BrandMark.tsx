/** Brand mark: four squares, one lit. Same motif as the landing grid. Square corners on purpose. */
export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <rect x="3" y="3" width="8" height="8" style={{ fill: "var(--muted)", opacity: 0.4 }} />
      <rect x="13" y="3" width="8" height="8" style={{ fill: "var(--accent)" }} />
      <rect x="3" y="13" width="8" height="8" style={{ fill: "var(--muted)", opacity: 0.4 }} />
      <rect x="13" y="13" width="8" height="8" style={{ fill: "var(--muted)", opacity: 0.4 }} />
    </svg>
  );
}

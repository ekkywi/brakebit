import type { ReactNode } from "react";
import type { NavIconName } from "../nav";

/**
 * Dashboard icon set, drawn on a 24px grid with one stroke weight and square
 * geometry (3px corner radius) to match the square motif. Icons are decorative:
 * every control that uses one carries its own accessible name.
 */
function IconBase({
  size = 20,
  children,
}: {
  size?: number;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Overview: a framed layout, one wide panel and one split. */
function OverviewIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M10 4v16M10 11h11" />
    </IconBase>
  );
}

/** Check: a magnifier whose lens is a rounded square. */
function CheckIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="4" y="4" width="12" height="12" rx="3" />
      <path d="M14.5 14.5L20 20" />
    </IconBase>
  );
}

export function NavIcon({ name, size }: { name: NavIconName; size?: number }) {
  return name === "overview" ? (
    <OverviewIcon size={size} />
  ) : (
    <CheckIcon size={size} />
  );
}

/** Double chevron pointing left. The sidebar toggle flips it when collapsed. */
export function MenuIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function CloseIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M6 6l12 12M18 6L6 18" />
    </IconBase>
  );
}

export function UserIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </IconBase>
  );
}

/** Brand mark: four squares, one lit. Same motif as the landing grid. */
export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <rect x="3" y="3" width="8" height="8" rx="2" style={{ fill: "var(--muted)", opacity: 0.4 }} />
      <rect x="13" y="3" width="8" height="8" rx="2" style={{ fill: "var(--accent)" }} />
      <rect x="3" y="13" width="8" height="8" rx="2" style={{ fill: "var(--muted)", opacity: 0.4 }} />
      <rect x="13" y="13" width="8" height="8" rx="2" style={{ fill: "var(--muted)", opacity: 0.4 }} />
    </svg>
  );
}

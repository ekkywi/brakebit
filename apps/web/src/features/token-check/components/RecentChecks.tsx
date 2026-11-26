"use client";

import { useEffect, useState } from "react";
import type { RiskLevel } from "@brakebit/shared";
import { fetchRecentChecks, type RecentCheckItem } from "../api";
import { levelLabel } from "../lib/format";

type Props = {
  onSelect: (item: RecentCheckItem) => void;
  refreshToken?: number;
  selectedAddress?: string;
};

function shortMint(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function levelTone(level: string): string {
  switch (level as RiskLevel) {
    case "low":
      return "var(--ok)";
    case "medium":
      return "var(--warn)";
    case "high":
    case "critical":
      return "var(--bad)";
    default:
      return "var(--muted)";
  }
}

function displayName(item: RecentCheckItem): string {
  const name = item.token?.name?.trim();
  const symbol = item.token?.symbol?.trim();
  if (name && symbol) return `${name} (${symbol})`;
  if (name) return name;
  if (symbol) return symbol;
  return shortMint(item.address);
}

function fallbackGlyph(item: RecentCheckItem): string {
  const symbol = item.token?.symbol?.trim();
  if (symbol) return symbol.slice(0, 2).toUpperCase();
  return item.address.slice(0, 2).toUpperCase();
}

export function RecentChecks({
  onSelect,
  refreshToken = 0,
  selectedAddress = "",
}: Props) {
  const [items, setItems] = useState<RecentCheckItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void fetchRecentChecks(20)
      .then((rows) => {
        if (!cancelled) setItems(rows);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  const selected = selectedAddress.trim();

  return (
    <section aria-labelledby="recent-checks-heading">
      <div className="cell border-b border-[var(--border)] py-4">
        <p id="recent-checks-heading" className="section-label">
          Recently reviewed
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Global mints checked on Brakebit. One row per token; score from the
          latest check. Select a row to review.
        </p>
      </div>

      <div className="screener-table-scroll">
        <table className="screener-table screener-table--sheet">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Score</th>
              <th scope="col" className="screener-col-level">
                Level
              </th>
              <th scope="col" className="screener-col-checked">
                Checked
              </th>
              <th scope="col" className="screener-col-mint">
                Mint
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="screener-table-empty">
                  Loading reviewed mints…
                </td>
              </tr>
            ) : null}
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={5} className="screener-table-empty">
                  No reviews yet. Generate a report to populate this table.
                </td>
              </tr>
            ) : null}
            {!loading
              ? items.map((item) => {
                  const label = displayName(item);
                  const checkedLocal = new Date(
                    item.createdAt,
                  ).toLocaleString();
                  const tone = levelTone(item.level);
                  const isSelected = selected === item.address;

                  return (
                    <tr
                      key={item.id}
                      className={
                        isSelected ? "screener-row screener-row--active" : "screener-row"
                      }
                    >
                      <td>
                        <button
                          type="button"
                          className="screener-row-btn"
                          onClick={() => onSelect(item)}
                          aria-label={`Review ${label}, score ${item.score}`}
                          aria-current={isSelected ? "true" : undefined}
                        >
                          {item.token?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.token.imageUrl}
                              alt=""
                              width={28}
                              height={28}
                              className="h-7 w-7 shrink-0 rounded-md object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="token-search-hit-fallback">
                              {fallbackGlyph(item)}
                            </span>
                          )}
                          <span className="min-w-0 text-left">
                            <span className="block truncate text-sm text-[var(--fg)]">
                              {label}
                            </span>
                            <span className="font-mono-ui mt-0.5 block truncate text-[11px] text-[var(--muted)] sm:hidden">
                              {shortMint(item.address)}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td>
                        <span
                          className="font-semibold tabular-nums tracking-tight"
                          style={{ color: tone }}
                        >
                          {item.score}
                        </span>
                      </td>
                      <td className="screener-col-level">
                        <span className="text-xs" style={{ color: tone }}>
                          {levelLabel(item.level as RiskLevel)}
                        </span>
                      </td>
                      <td className="screener-col-checked">
                        <span className="text-xs text-[var(--muted)]">
                          {checkedLocal}
                        </span>
                      </td>
                      <td className="screener-col-mint">
                        <span className="font-mono-ui text-[11px] text-[var(--muted)]">
                          {shortMint(item.address)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

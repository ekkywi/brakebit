"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RiskReport } from "@brakebit/shared";
import { CHECK_GUIDANCE, SAMPLE_CHECK } from "@/shared/content/product";
import {
  createTokenCheck,
  searchTokens,
  type RecentCheckItem,
  type TokenSearchHit,
} from "../api";
import {
  addressFieldCopy,
  addressValidationMessage,
  isAddressReady,
} from "../lib/address";
import { RecentChecks } from "./RecentChecks";
import { ReportSkeleton } from "./ReportSkeleton";
import { RiskReportView } from "./RiskReportView";

export function TokenCheckForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchListId = useId();

  const [address, setAddress] = useState(() => searchParams.get("address") ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHits, setSearchHits] = useState<TokenSearchHit[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [exampleNote, setExampleNote] = useState<string | null>(() =>
    searchParams.get("example") === "1" ? SAMPLE_CHECK.note : null,
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [recentRefresh, setRecentRefresh] = useState(0);

  const searchSeq = useRef(0);
  const panelRef = useRef<HTMLElement | null>(null);

  const fieldCopy = addressFieldCopy();
  const canSubmit = isAddressReady(address);
  const validationMessage = addressValidationMessage(address);
  const currentQuery = searchParams.toString();
  const showPanel = loading || Boolean(report);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("chain", "solana");
    const trimmed = address.trim();
    if (trimmed) params.set("address", trimmed);
    if (exampleNote) params.set("example", "1");
    const next = params.toString();
    if (next !== currentQuery) {
      router.replace(`${pathname}?${next}`, { scroll: false });
    }
  }, [address, exampleNote, pathname, router, currentQuery]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchHits([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    const seq = ++searchSeq.current;
    setSearchLoading(true);
    setSearchError(null);

    const timer = window.setTimeout(() => {
      void searchTokens(q)
        .then((hits) => {
          if (seq !== searchSeq.current) return;
          setSearchHits(hits);
          setSearchOpen(true);
        })
        .catch((err) => {
          if (seq !== searchSeq.current) return;
          setSearchHits([]);
          setSearchError(
            err instanceof Error ? err.message : "Token search failed",
          );
        })
        .finally(() => {
          if (seq !== searchSeq.current) return;
          setSearchLoading(false);
        });
    }, 320);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!showPanel || !panelRef.current) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showPanel, loading, report]);

  function loadSample() {
    setAddress(SAMPLE_CHECK.address);
    setExampleNote(SAMPLE_CHECK.note);
    setSelectedLabel("Bonk (BONK)");
    setSearchQuery("");
    setSearchHits([]);
    setSearchOpen(false);
    setReport(null);
    setError(null);
  }

  function checkAnother() {
    setReport(null);
    setError(null);
    setAddress("");
    setExampleNote(null);
    setSelectedLabel(null);
    setSearchQuery("");
    setSearchHits([]);
    setSearchOpen(false);
  }

  function pickHit(hit: TokenSearchHit) {
    setAddress(hit.mint);
    setSelectedLabel(`${hit.name} (${hit.symbol})`);
    setSearchQuery("");
    setSearchHits([]);
    setSearchOpen(false);
    setExampleNote(null);
    setReport(null);
    setError(null);
  }

  async function runCheck(mint: string) {
    const trimmed = mint.trim();
    if (!isAddressReady(trimmed)) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await createTokenCheck({
        address: trimmed,
        chain: "solana",
      });
      setReport(result);
      setRecentRefresh((n) => n + 1);
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function pickRecent(item: RecentCheckItem) {
    const name = item.token?.name?.trim();
    const symbol = item.token?.symbol?.trim();
    setAddress(item.address);
    setSelectedLabel(
      name && symbol ? `${name} (${symbol})` : name || symbol || null,
    );
    setSearchQuery("");
    setSearchHits([]);
    setSearchOpen(false);
    setExampleNote(null);
    void runCheck(item.address);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    await runCheck(address);
  }

  return (
    <div className="screener space-y-4">
      <form onSubmit={onSubmit} className="screener-toolbar card">
        <div className="screener-toolbar-grid">
          <p className="screener-network text-xs text-[var(--muted)]">
            Network <span className="text-[var(--fg)]">Solana</span>
          </p>

          <div className="relative min-w-0">
            <label className="block" htmlFor={`${searchListId}-search`}>
              <span className="sr-only">Search by name or symbol</span>
              <input
                id={`${searchListId}-search`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => {
                  if (searchHits.length > 0) setSearchOpen(true);
                }}
                placeholder="Search name or symbol"
                className="field-input"
                autoComplete="off"
                spellCheck={false}
                aria-autocomplete="list"
                aria-controls={`${searchListId}-results`}
                aria-expanded={searchOpen && searchHits.length > 0}
              />
            </label>

            {searchOpen && searchHits.length > 0 ? (
              <ul
                id={`${searchListId}-results`}
                role="listbox"
                className="token-search-results"
              >
                {searchHits.map((hit) => (
                  <li key={hit.mint} role="option">
                    <button
                      type="button"
                      className="token-search-hit"
                      onClick={() => pickHit(hit)}
                    >
                      {hit.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={hit.imageUrl}
                          alt=""
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-md object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="token-search-hit-fallback">
                          {hit.symbol.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0 text-left">
                        <span className="block truncate text-sm text-[var(--fg)]">
                          {hit.name}{" "}
                          <span className="text-[var(--muted)]">
                            ({hit.symbol})
                          </span>
                        </span>
                        <span className="font-mono-ui block truncate text-[11px] text-[var(--muted)]">
                          {hit.mint}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="min-w-0">
            <label className="block" htmlFor={`${searchListId}-mint`}>
              <span className="sr-only">{fieldCopy.label}</span>
              <input
                id={`${searchListId}-mint`}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setSelectedLabel(null);
                  setExampleNote(null);
                  setReport(null);
                  setError(null);
                }}
                placeholder={fieldCopy.placeholder}
                className="field-input"
                autoComplete="off"
                spellCheck={false}
                required
                aria-invalid={validationMessage ? true : undefined}
                aria-describedby={
                  validationMessage
                    ? "address-validation"
                    : selectedLabel
                      ? "address-selected"
                      : "address-hint"
                }
              />
            </label>
          </div>

          <div className="screener-toolbar-actions">
            <button
              type="button"
              className="nav-link text-xs whitespace-nowrap"
              onClick={loadSample}
            >
              Example
            </button>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="btn btn-primary btn-sm whitespace-nowrap"
            >
              {loading ? "Checking…" : "Generate"}
            </button>
          </div>
        </div>

        <div className="screener-toolbar-meta">
          {searchLoading ? (
            <p className="text-xs text-[var(--muted)]">Searching…</p>
          ) : null}
          {searchError ? (
            <p className="text-xs text-[var(--bad)]">{searchError}</p>
          ) : null}
          {validationMessage ? (
            <p id="address-validation" className="text-xs text-[var(--bad)]">
              {validationMessage}
            </p>
          ) : selectedLabel ? (
            <p id="address-selected" className="text-xs text-[var(--muted)]">
              Selected: {selectedLabel}
            </p>
          ) : (
            <p id="address-hint" className="text-xs text-[var(--muted)]">
              {fieldCopy.hint} Tickers are not unique; confirm the mint.
            </p>
          )}
          {exampleNote ? (
            <p className="text-xs text-[var(--muted)]">{exampleNote}</p>
          ) : null}
        </div>
      </form>

      {error ? (
        <p role="alert" className="alert-error">
          {error}
        </p>
      ) : null}

      <div
        className={
          showPanel ? "screener-body screener-body--split" : "screener-body"
        }
      >
        <div className="screener-main space-y-4">
          <RecentChecks
            onSelect={pickRecent}
            refreshToken={recentRefresh}
            selectedAddress={address}
          />

          {!showPanel ? (
            <div className="card p-5">
              <p className="text-sm font-medium text-[var(--fg)]">
                What you get in a report
              </p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CHECK_GUIDANCE.map((item) => (
                  <li key={item.title}>
                    <p className="text-sm text-[var(--fg)]">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {showPanel ? (
          <aside
            ref={panelRef}
            className="screener-panel"
            aria-label="Risk report panel"
          >
            {loading ? <ReportSkeleton /> : null}
            {!loading && report ? (
              <RiskReportView
                report={report}
                onCheckAnother={checkAnother}
                compact
              />
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

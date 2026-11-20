"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RiskReport } from "@brakebit/shared";
import { CHECK_GUIDANCE, SAMPLE_CHECK } from "@/shared/content/product";
import { createTokenCheck, searchTokens, type TokenSearchHit } from "../api";
import {
  addressFieldCopy,
  addressValidationMessage,
  isAddressReady,
} from "../lib/address";
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

  const searchSeq = useRef(0);

  const fieldCopy = addressFieldCopy();
  const canSubmit = isAddressReady(address);
  const validationMessage = addressValidationMessage(address);
  const currentQuery = searchParams.toString();

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await createTokenCheck({
        address: address.trim(),
        chain: "solana",
      });
      setReport(result);
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="card">
        <div className="space-y-6 p-6">
          <p className="text-sm text-[var(--muted)]">
            Network: <span className="text-[var(--fg)]">Solana</span>
          </p>

          <div className="relative">
            <label className="block" htmlFor={`${searchListId}-search`}>
              <span className="text-sm font-medium text-[var(--fg)]">
                Search by name or symbol
              </span>
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
                placeholder="e.g. BONK or Bonk"
                className="field-input mt-3"
                autoComplete="off"
                spellCheck={false}
                aria-autocomplete="list"
                aria-controls={`${searchListId}-results`}
                aria-expanded={searchOpen && searchHits.length > 0}
              />
            </label>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Pick a result to fill the mint. Tickers are not unique — confirm
              the address.
            </p>

            {searchLoading ? (
              <p className="mt-2 text-xs text-[var(--muted)]">Searching…</p>
            ) : null}
            {searchError ? (
              <p className="mt-2 text-xs text-[var(--bad)]">{searchError}</p>
            ) : null}

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

          <label className="block">
            <span className="text-sm font-medium text-[var(--fg)]">
              {fieldCopy.label}
            </span>
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setSelectedLabel(null);
                setExampleNote(null);
                setReport(null);
                setError(null);
              }}
              placeholder={fieldCopy.placeholder}
              className="field-input mt-3"
              autoComplete="off"
              spellCheck={false}
              required
              aria-invalid={validationMessage ? true : undefined}
              aria-describedby={
                validationMessage ? "address-validation" : "address-hint"
              }
            />
            {selectedLabel ? (
              <span className="mt-2 block text-xs text-[var(--muted)]">
                Selected: {selectedLabel}
              </span>
            ) : null}
            {validationMessage ? (
              <span
                id="address-validation"
                className="mt-2 block text-xs text-[var(--bad)]"
              >
                {validationMessage}
              </span>
            ) : (
              <span
                id="address-hint"
                className="mt-2 block text-xs text-[var(--muted)]"
              >
                {fieldCopy.hint}
              </span>
            )}
          </label>

          {exampleNote ? (
            <p className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--subtle)] px-3 py-2 text-xs text-[var(--muted)]">
              {exampleNote}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--subtle)] px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-[var(--muted)]">
              {loading
                ? "Gathering signals…"
                : !address.trim()
                  ? "Search or paste a Solana mint to continue"
                  : canSubmit
                    ? "Ready on Solana"
                    : "Fix the mint address format to continue"}
            </p>
            <button
              type="button"
              className="nav-link text-xs"
              onClick={loadSample}
            >
              Use example address
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="btn btn-primary btn-sm"
          >
            {loading ? "Preparing report…" : "Generate report"}
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" className="alert-error">
          {error}
        </p>
      ) : null}

      {loading ? <ReportSkeleton /> : null}

      {!loading && report ? (
        <RiskReportView report={report} onCheckAnother={checkAnother} />
      ) : null}

      {!loading && !report ? (
        <div className="card p-6">
          <p className="text-sm font-medium text-[var(--fg)]">
            What you get in a report
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
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
  );
}

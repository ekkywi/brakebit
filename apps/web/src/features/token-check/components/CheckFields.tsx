"use client";

import { useId } from "react";
import type { TokenCheck } from "../hooks/use-token-check";

type FieldProps = {
  check: TokenCheck;
  /** Show the label above the input. Off: it stays in the DOM for screen readers. */
  showLabel?: boolean;
};

const LABEL_CLASS = "block text-sm font-medium text-[var(--fg)]";

/** Search by name or symbol, with the result list. Picking a hit fills the mint. */
export function SearchField({ check, showLabel = false }: FieldProps) {
  const id = useId();
  const open = check.searchOpen && check.searchHits.length > 0;

  return (
    <div className="relative min-w-0">
      <label
        htmlFor={`${id}-search`}
        className={showLabel ? LABEL_CLASS : "sr-only"}
      >
        Search by name or symbol
      </label>
      <input
        id={`${id}-search`}
        value={check.searchQuery}
        onChange={(e) => check.changeSearch(e.target.value)}
        onFocus={check.openSearch}
        placeholder="Search name or symbol"
        className={showLabel ? "field-input mt-2" : "field-input"}
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={`${id}-results`}
        aria-expanded={open}
      />

      {open ? (
        <ul id={`${id}-results`} role="listbox" className="token-search-results">
          {check.searchHits.map((hit) => (
            <li key={hit.mint} role="option" aria-selected={false}>
              <button
                type="button"
                className="token-search-hit"
                onClick={() => check.pickHit(hit)}
              >
                {hit.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hit.imageUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 object-cover"
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
                    <span className="text-[var(--muted)]">({hit.symbol})</span>
                  </span>
                  <span className="font-mono-ui block truncate text-xs text-[var(--muted)]">
                    {hit.mint}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** The mint address input. It always describes itself through `FieldMessages`. */
export function MintField({ check, showLabel = false }: FieldProps) {
  const id = useId();
  const describedBy = check.validationMessage
    ? "address-validation"
    : check.selectedLabel
      ? "address-selected"
      : "address-hint";

  return (
    <div className="min-w-0">
      <label
        htmlFor={`${id}-mint`}
        className={showLabel ? LABEL_CLASS : "sr-only"}
      >
        {check.fieldCopy.label}
      </label>
      <input
        id={`${id}-mint`}
        value={check.address}
        onChange={(e) => check.changeAddress(e.target.value)}
        placeholder={check.fieldCopy.placeholder}
        className={showLabel ? "field-input mt-2" : "field-input"}
        autoComplete="off"
        spellCheck={false}
        required
        aria-invalid={check.validationMessage ? true : undefined}
        aria-describedby={describedBy}
      />
    </div>
  );
}

/** Fills the BONK mint so a visitor can see a report without hunting for an address. */
export function SampleButton({ check }: { check: TokenCheck }) {
  return (
    <button
      type="button"
      onClick={check.loadSample}
      className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--fg)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
    >
      Try the BONK example
    </button>
  );
}

/** Search status, validation, the selected token, or the hint, in that order. */
export function FieldMessages({ check }: { check: TokenCheck }) {
  return (
    <div className="flex flex-col gap-1">
      {check.searchLoading ? (
        <p className="text-xs text-[var(--muted)]">Searching…</p>
      ) : null}
      {check.searchError ? (
        <p className="text-xs text-[var(--bad)]">{check.searchError}</p>
      ) : null}
      {check.validationMessage ? (
        <p id="address-validation" className="text-xs text-[var(--bad)]">
          {check.validationMessage}
        </p>
      ) : check.selectedLabel ? (
        <p id="address-selected" className="text-xs text-[var(--muted)]">
          Selected: {check.selectedLabel}
        </p>
      ) : (
        <p id="address-hint" className="text-xs text-[var(--muted)]">
          {check.fieldCopy.hint} Tickers are not unique; confirm the mint.
        </p>
      )}
      {check.exampleNote ? (
        <p className="text-xs text-[var(--muted)]">{check.exampleNote}</p>
      ) : null}
    </div>
  );
}

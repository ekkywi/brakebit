"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CHAIN_META,
  getChainMeta,
  type Chain,
  type RiskReport,
} from "@brakebit/shared";
import { CHECK_COVERAGE } from "@/shared/content/product";
import { createTokenCheck } from "../api";
import { addressFieldCopy, isAddressReady } from "../lib/address";
import { RiskReportView } from "./RiskReportView";

export function TokenCheckForm() {
  const [chain, setChain] = useState<Chain>("ethereum");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<RiskReport | null>(null);

  const fieldCopy = useMemo(() => addressFieldCopy(chain), [chain]);
  const chainLabel = getChainMeta(chain).label;
  const canSubmit = isAddressReady(address, chain);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createTokenCheck({
        address: address.trim(),
        chain,
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
          <fieldset>
            <legend className="text-sm font-medium text-[var(--fg)]">
              Network
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHAIN_META.map((item) => {
                const selected = item.id === chain;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setChain(item.id);
                      setReport(null);
                      setError(null);
                    }}
                    className={`chain-chip${selected ? " is-selected" : ""}`}
                    aria-pressed={selected}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-medium text-[var(--fg)]">
              {fieldCopy.label}
            </span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={fieldCopy.placeholder}
              className="field-input mt-3"
              autoComplete="off"
              spellCheck={false}
              required
            />
            <span className="mt-2 block text-xs text-[var(--muted)]">
              {fieldCopy.hint}
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--subtle)] px-6 py-4">
          <p className="text-xs text-[var(--muted)]">
            {loading ? "Gathering signals…" : `Reviewing on ${chainLabel}`}
          </p>
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
        <p
          role="alert"
          className="rounded-[var(--radius)] border border-[#f5c2bd] bg-[#fef3f2] px-4 py-3 text-sm text-[var(--bad)]"
        >
          {error}
        </p>
      ) : null}

      {report ? (
        <RiskReportView report={report} />
      ) : (
        <div className="card p-6">
          <p className="text-sm font-medium text-[var(--fg)]">
            What the report covers
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {CHECK_COVERAGE.map(([title, detail]) => (
              <li key={title}>
                <p className="text-sm text-[var(--fg)]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

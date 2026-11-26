"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import {
  addressValidationMessage,
  isAddressReady,
} from "@/features/token-check/lib/address";
import { SAMPLE_CHECK_HREF } from "@/shared/content/product";
import { SpecStrip } from "@/shared/ui/SpecStrip";

/**
 * Landing hero. The mint field only hands the address to /check; the check
 * itself (and any guest quota) runs when the visitor starts it there.
 * The strip of six squares lights the readable signals once a mint of
 * plausible length is in the field. Nothing is fetched here.
 */
export function LandingHero() {
  const router = useRouter();
  const inputId = useId();
  const messageId = useId();
  const [mint, setMint] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ready = isAddressReady(mint);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = mint.trim();
    const problem = value
      ? addressValidationMessage(value)
      : "Paste a Solana mint address first.";
    if (problem) {
      setError(problem);
      return;
    }
    router.push(`/check?chain=solana&address=${encodeURIComponent(value)}`);
  }

  return (
    <section>
      <div className="sheet">
        <div className="cell anim-rise pb-10 pt-12 md:pb-14 md:pt-20">
          <p className="font-mono-ui text-xs text-[var(--muted)]">
            Solana · read-only · never asks for keys
          </p>
          <h1
            aria-label="Brake before you buy."
            className="mt-6 text-[clamp(2.9rem,9.2vw,8rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[var(--fg)]"
          >
            <span aria-hidden className="block">
              Brake before
            </span>
            <span aria-hidden className="block">
              you buy
              <span className="stop" />
            </span>
          </h1>
        </div>

        <div className="grid border-t border-[var(--border)] md:grid-cols-12">
          <p className="cell py-8 text-[17px] leading-relaxed text-[var(--muted)] md:col-span-5 md:border-r md:border-[var(--border)] md:py-10">
            Paste a Solana mint, get a risk report with findings and signals.
            Indicators only. Not investment advice.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="cell border-t border-[var(--border)] py-8 md:col-span-7 md:border-t-0 md:py-10"
          >
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-[var(--fg)]"
            >
              Mint address
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                name="address"
                className="field-input"
                placeholder="Paste a Solana mint address"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={mint}
                onChange={(event) => {
                  setMint(event.target.value);
                  setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={messageId}
              />
              <button type="submit" className="btn btn-primary shrink-0">
                Review this mint
              </button>
            </div>
            {error ? (
              <p
                id={messageId}
                role="alert"
                className="mt-2 text-sm text-[var(--bad)]"
              >
                {error}
              </p>
            ) : (
              <p id={messageId} className="mt-2 text-sm text-[var(--muted)]">
                Opens the review with this mint filled in. The check runs when
                you start it.
              </p>
            )}
            <p className="mt-3 text-sm text-[var(--muted)]">
              No mint at hand?{" "}
              <Link
                href={SAMPLE_CHECK_HREF}
                className="inline-flex min-h-11 items-center font-medium text-[var(--fg)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
              >
                Try the BONK example
              </Link>
            </p>
          </form>
        </div>

        <SpecStrip ready={ready} />
      </div>
    </section>
  );
}

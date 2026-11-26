"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RiskReport } from "@brakebit/shared";
import { SAMPLE_CHECK } from "@/shared/content/product";
import { ApiError } from "@/shared/api/client";
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

type Options = {
  /** Return true when the error is handled elsewhere, so no inline alert is shown. */
  onApiError?: (error: ApiError, context: { mint: string }) => boolean;
  /** Runs after every check settles, whether it returned a report or failed. */
  onSettled?: () => void;
};

/**
 * State and actions of the check workspace. The guest page and the member page
 * both build on it and only differ in layout and access rules, so the two
 * screens can look different without the check flow being written twice.
 * Needs a Suspense boundary above it (reads the URL search params).
 */
export function useTokenCheck({ onApiError, onSettled }: Options = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [address, setAddress] = useState(() => searchParams.get("address") ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHits, setSearchHits] = useState<TokenSearchHit[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [exampleNote, setExampleNote] = useState<string | null>(() =>
    searchParams.get("example") === "1" ? SAMPLE_CHECK.note : null,
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [recentRefresh, setRecentRefresh] = useState(0);

  const searchSeq = useRef(0);
  const panelRef = useRef<HTMLElement | null>(null);

  const fieldCopy = addressFieldCopy();
  const ready = isAddressReady(address);
  const validationMessage = addressValidationMessage(address);
  const currentQuery = searchParams.toString();
  const showPanel = loading || Boolean(report);

  // Keep the address in the URL so a review can be shared and survives a reload.
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

  // On small screens the report opens under the list, so bring it into view.
  useEffect(() => {
    if (!showPanel || !panelRef.current) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showPanel, loading, report]);

  function closeSearch() {
    setSearchQuery("");
    setSearchHits([]);
    setSearchOpen(false);
  }

  function changeSearch(value: string) {
    setSearchQuery(value);
    setSearchOpen(true);
  }

  function changeAddress(value: string) {
    setAddress(value);
    setSelectedLabel(null);
    setExampleNote(null);
    setReport(null);
    setError(null);
  }

  function loadSample() {
    setAddress(SAMPLE_CHECK.address);
    setExampleNote(SAMPLE_CHECK.note);
    setSelectedLabel("Bonk (BONK)");
    closeSearch();
    setReport(null);
    setError(null);
  }

  function checkAnother() {
    setReport(null);
    setError(null);
    setAddress("");
    setExampleNote(null);
    setSelectedLabel(null);
    closeSearch();
  }

  function pickHit(hit: TokenSearchHit) {
    setAddress(hit.mint);
    setSelectedLabel(`${hit.name} (${hit.symbol})`);
    closeSearch();
    setExampleNote(null);
    setReport(null);
    setError(null);
  }

  async function runCheck(mint: string) {
    const trimmed = mint.trim();
    if (!isAddressReady(trimmed)) return;

    setLoading(true);
    setError(null);
    setErrorCode(null);
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
      if (err instanceof ApiError && onApiError?.(err, { mint: trimmed })) {
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
      setErrorCode(err instanceof ApiError ? err.code : null);
    } finally {
      setLoading(false);
      onSettled?.();
    }
  }

  /** Fills the mint and runs a live check. */
  function run(mint: string) {
    setAddress(mint.trim());
    setSelectedLabel(null);
    setExampleNote(null);
    void runCheck(mint);
  }

  function pickRecent(item: RecentCheckItem) {
    const name = item.token?.name?.trim();
    const symbol = item.token?.symbol?.trim();
    setAddress(item.address);
    setSelectedLabel(
      name && symbol ? `${name} (${symbol})` : name || symbol || null,
    );
    closeSearch();
    setExampleNote(null);
    void runCheck(item.address);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    await runCheck(address);
  }

  return {
    // field state
    address,
    searchQuery,
    searchHits,
    searchOpen,
    searchLoading,
    searchError,
    selectedLabel,
    exampleNote,
    fieldCopy,
    validationMessage,
    ready,
    // check state
    loading,
    error,
    errorCode,
    report,
    showPanel,
    recentRefresh,
    panelRef,
    // actions
    changeSearch,
    changeAddress,
    openSearch: () => {
      if (searchHits.length > 0) setSearchOpen(true);
    },
    loadSample,
    checkAnother,
    pickHit,
    pickRecent,
    run,
    submit,
  };
}

export type TokenCheck = ReturnType<typeof useTokenCheck>;

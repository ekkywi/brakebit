"use client";

import Link from "next/link";
import { SignInButton } from "@/features/auth/components/SignInButton";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-[var(--fg)]"
        >
          Brakebit
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/#features" className="nav-link hidden sm:inline">
            Product
          </Link>
          <Link href="/#report" className="nav-link hidden sm:inline">
            How it works
          </Link>
          <SignInButton />
          <ThemeToggle />
          <Link href="/check" className="btn btn-primary btn-sm whitespace-nowrap">
            Start a review
          </Link>
        </nav>
      </div>
    </header>
  );
}

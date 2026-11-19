import type { Metadata } from "next";
import Link from "next/link";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { themeInitScript } from "@/shared/theme/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brakebit | token risk review",
  description:
    "Review token risk before you buy across major networks. Supply control, transfer restrictions, liquidity, and holder signals with clear explanations. Risk indicators only, not investment advice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <header className="site-header">
          <div className="wrap flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--fg)]"
            >
              Brakebit
            </Link>
            <nav className="flex items-center gap-3 sm:gap-5">
              <Link href="/#features" className="nav-link hidden sm:inline">
                Product
              </Link>
              <Link href="/#signals" className="nav-link hidden md:inline">
                Signals
              </Link>
              <Link href="/#how" className="nav-link hidden sm:inline">
                How it works
              </Link>
              <ThemeToggle />
              <Link href="/check" className="btn btn-primary btn-sm">
                Start a review
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)]">
          <div className="wrap flex flex-col gap-3 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-start sm:justify-between">
            <p className="font-medium text-[var(--fg)]">Brakebit</p>
            <p className="max-w-lg sm:text-right">
              Risk indicators only. Brakebit does not execute trades, custody
              assets, or offer investment advice. Always verify findings against
              primary sources before you buy.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

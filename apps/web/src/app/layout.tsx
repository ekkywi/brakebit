import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteHeader } from "@/shared/ui/SiteHeader";
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
        <SiteHeader />
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

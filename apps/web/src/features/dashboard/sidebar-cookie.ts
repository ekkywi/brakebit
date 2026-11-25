/**
 * Sidebar width preference. Stored in a cookie, not localStorage, so the server
 * layout can render the right width on the first paint. Holds only the word
 * "collapsed" or "expanded"; nothing private.
 */
export const SIDEBAR_COOKIE = "brakebit_sidebar";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function isSidebarCollapsed(cookieValue: string | undefined): boolean {
  return cookieValue === "collapsed";
}

/** Client only. Called when the user toggles the sidebar. */
export function saveSidebarCollapsed(collapsed: boolean): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? "collapsed" : "expanded"}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
}

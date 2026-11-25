/**
 * Shared by middleware (server) and RedirectIfSignedIn (client), so the two
 * cannot drift apart. Keep the cookie name in sync with the API's SESSION_COOKIE.
 */
export const SESSION_COOKIE_NAME = "brakebit_session";

/** Query flag set when the dashboard found no valid session. Stops a stale cookie from looping. */
export const SIGNED_OUT_PARAM = "signedout";

/** Where a visitor goes when the dashboard finds no valid session. */
export const SIGNED_OUT_URL = `/?${SIGNED_OUT_PARAM}=1`;

/** Public pages that have an app counterpart. Signed-in users are sent there. */
export const APP_COUNTERPART: Readonly<Record<string, string>> = {
  "/": "/dashboard",
  "/check": "/dashboard/check",
};

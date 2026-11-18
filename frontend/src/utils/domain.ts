export const PORTAL_DOMAIN = "https://sabbilferdyansyah.my.id";
export const PORTFOLIO_DOMAIN = "https://www.sabbilferdyans.cyou";

/**
 * Checks if the current visitor is accessing the dedicated portfolio domain.
 * Supports:
 * - Direct domain: sabbilferdyans.cyou (or www.sabbilferdyans.cyou)
 * - Subdomain: portfolio.* (e.g. portfolio.sabbilferdyansyah.my.id)
 * - Dev testing override: ?view=portfolio
 */
export function isPortfolioHost(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();
  const search = window.location.search;

  if (search.includes("view=portfolio")) return true;
  if (hostname.includes("sabbilferdyans.cyou")) return true;
  if (hostname.startsWith("portfolio.")) return true;

  return false;
}

export function isPortalHost(): boolean {
  return !isPortfolioHost();
}

export function isLocalDev(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
}

/**
 * Helper to get proper URL for Navigation Portal.
 * If currently on portfolio domain, returns absolute URL to portal domain.
 * If on portal domain, returns relative path "/".
 */
export function getPortalUrl(path = "/"): string {
  if (isPortfolioHost()) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${PORTAL_DOMAIN}${cleanPath}`;
  }
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Helper to get proper URL for Portfolio.
 * If currently on portal domain in production, returns absolute URL to portfolio domain.
 * If in development or already on portfolio domain, returns relative path.
 */
export function getPortfolioUrl(path = "/"): string {
  if (typeof window !== "undefined") {
    if (!isPortfolioHost() && !isLocalDev()) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${PORTFOLIO_DOMAIN}${cleanPath === "/" ? "" : cleanPath}`;
    }
  }
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Helper to get proper URL for Projects / Selected Works.
 * Selected works page is hosted on sabbilferdyans.cyou/projects.
 */
export function getProjectsUrl(): string {
  return getPortfolioUrl("/projects");
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function getBasePath() {
  return BASE_PATH;
}

export function withBasePath(pathname: string) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BASE_PATH}${normalizedPathname}`;
}

export function getSiteUrl() {
  if (typeof window !== "undefined") {
    const isLocalHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalHost) {
      return `${window.location.origin}${BASE_PATH}`.replace(/\/+$/, "");
    }
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${BASE_PATH}`.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

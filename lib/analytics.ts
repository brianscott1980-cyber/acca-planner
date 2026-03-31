export const GA_MEASUREMENT_ID = "G-TKEBLQ7RZL";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      target: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export function trackPageView(path: string) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", name, params);
}

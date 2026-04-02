"use client";

import { useEffect } from "react";
import { withBasePath } from "../../lib/site";

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
        .catch(() => undefined);
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register(withBasePath("/sw.js"), {
          scope: withBasePath("/"),
        });
      } catch (error) {
        console.error("Failed to register service worker", error);
      }
    };

    if (document.readyState === "complete") {
      void registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return null;
}

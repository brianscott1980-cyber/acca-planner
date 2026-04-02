import type { MetadataRoute } from "next";
import { getBasePath, withBasePath } from "../lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = getBasePath();
  const startUrl = `${basePath || ""}/`;

  return {
    name: "Caddyshack Syndicate",
    short_name: "Caddyshack",
    description: "Track matchday votes, slips, and syndicate bankroll performance.",
    start_url: startUrl,
    scope: startUrl,
    display: "standalone",
    background_color: "#07111d",
    theme_color: "#0b1726",
    icons: [
      {
        src: withBasePath("/icon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: withBasePath("/icon-maskable.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: withBasePath("/apple-touch-icon.svg"),
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

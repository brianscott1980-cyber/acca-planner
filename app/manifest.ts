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
        src: withBasePath("/assets/app_logos/logo_64px.png"),
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/assets/app_logos/logo_192px.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/assets/app_logos/logo_512px.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/assets/app_logos/logo_512px.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: withBasePath("/assets/app_logos/logo_180px.png"),
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

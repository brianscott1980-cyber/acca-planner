import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleAnalytics } from "./ui/GoogleAnalytics";
import { AuthProvider } from "./ui/auth/AuthProvider";
import { PwaRegistration } from "./ui/PwaRegistration";
import { withBasePath } from "../lib/site";

export const metadata: Metadata = {
  title: "Caddyshack Syndicate",
  description: "AI powered syndicate, much more efficient at losing your stake",
  manifest: withBasePath("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Caddyshack",
  },
  icons: {
    icon: [
      {
        url: withBasePath("/assets/app_logos/logo_512px.png"),
        type: "image/png",
      },
    ],
    apple: {
      url: withBasePath("/assets/app_logos/logo_512px.png"),
      type: "image/png",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1726",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GoogleAnalytics />
          <PwaRegistration />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "./ui/GoogleAnalytics";
import { AuthProvider } from "./ui/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Syndicate Hub",
  description: "AI betting syndicate dashboard prototype built in React.",
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

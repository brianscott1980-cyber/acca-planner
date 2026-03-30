import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}

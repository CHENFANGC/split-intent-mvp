import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Split Intent",
  description: "Pay from different chains. Receive one final outcome."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


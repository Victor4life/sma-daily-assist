import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMA Daily Assist - Support for SMA Patients",
  description:
    "A simple, accessible platform connecting SMA patients with their caregivers for daily assistance and real-time communication",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo-sma.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-sma.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/logo-sma.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

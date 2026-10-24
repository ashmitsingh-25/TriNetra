import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "त्रिNETRA (TriNETRA) — AI-Powered UPI Fraud Prevention & Scam Intelligence",
  description: "Stop UPI scams before payment. Detect new scam waves before they spread with real-time QR forensic verification and TinyFish live-web intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#ededed] selection:bg-[#ff2a8d] selection:text-white">
        {children}
      </body>
    </html>
  );
}

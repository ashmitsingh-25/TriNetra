import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TrinetraAIChatbot from "@/components/ui/trinetra-ai-chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "त्रिNETRA // AI-Powered UPI Fraud Prevention & Scam Intelligence",
  description: "Stop UPI scams before payment. Detect new scam waves before they spread.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white selection:bg-[#ff2a8d] selection:text-white`}
      >
        {/* Main application content */}
        {children}

        {/* Global Floating AI Chatbot & 3D Spline Split Window */}
        <TrinetraAIChatbot />
      </body>
    </html>
  );
}

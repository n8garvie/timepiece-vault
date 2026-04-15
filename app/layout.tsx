import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "TimePiece Vault | Premium Watch Collection Tracker",
  description: "The intelligent platform for luxury watch collectors. Track value, manage service schedules, and protect your investments—all in one elegant dashboard.",
  keywords: ["watch collection", "luxury watches", "timepiece tracker", "watch valuation", "service reminders"],
  authors: [{ name: "TimePiece Vault" }],
  openGraph: {
    title: "TimePiece Vault | Premium Watch Collection Tracker",
    description: "The intelligent platform for luxury watch collectors. Track value, manage service schedules, and protect your investments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0A0A0B] text-[#FAFAFA]`}>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

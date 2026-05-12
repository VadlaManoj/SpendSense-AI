import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendSense | AI Spend Audit for Startups",
  description: "Audit your startup's AI tool stack in 60 seconds. Discover redundancies, downgrade over-provisioned plans, and instantly uncover hidden savings.",
  openGraph: {
    title: "SpendSense | AI Spend Audit for Startups",
    description: "Audit your startup's AI tool stack in 60 seconds and find hidden savings.",
    url: "https://spendsense-audit.vercel.app",
    siteName: "SpendSense",
    images: [
      {
        url: "https://spendsense-audit.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSense | AI Spend Audit for Startups",
    description: "Audit your startup's AI tool stack in 60 seconds and find hidden savings.",
    creator: "@spendsense",
    images: ["https://spendsense-audit.vercel.app/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">{children}</body>
    </html>
  );
}

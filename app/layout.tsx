import type { Metadata } from "next";
import { Crimson_Text, Caveat } from 'next/font/google';
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
});

const caveat = Caveat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: "Daily Entry",
  description: "Your day, saved to your calendar.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5ebe0' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1510' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Daily Entry',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${crimsonText.variable} ${caveat.variable}`}>{children}</body>
    </html>
  );
}


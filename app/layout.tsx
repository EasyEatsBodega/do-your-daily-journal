import type { Metadata } from "next";
import { Merriweather, Courier_Prime } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-courier',
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
      <body className={`${merriweather.variable} ${courierPrime.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


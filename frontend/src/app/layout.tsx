import type { Metadata } from 'next';
import { Inter, Geist, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CuraVIP - Autonomous Cultural Intelligence & VIP Concierge',
  description:
    'Eradicating Cultural Blindness in Executive Gifting and Relationship Management via Qloo Taste Graph and Model Context Protocol',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable} ${cormorant.variable} dark`}>
      <body className="font-sans antialiased text-stone-100 min-h-[100dvh] bg-[#070709] selection:bg-champagne-500/20 selection:text-champagne-400">
        {children}
      </body>
    </html>
  );
}
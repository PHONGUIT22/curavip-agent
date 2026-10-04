import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased text-stone-100 min-h-[100dvh] bg-[#070709] selection:bg-champagne-500/20 selection:text-champagne-400">
        {children}
      </body>
    </html>
  );
}
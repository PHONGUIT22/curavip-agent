import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="font-sans antialiased text-stone-100 min-h-[100dvh] bg-[#070709] selection:bg-champagne-500/20 selection:text-champagne-400">
        {children}
      </body>
    </html>
  );
}
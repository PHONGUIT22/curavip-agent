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
    <html lang="en">
      <body className="font-sans antialiased text-[#161A18] min-h-[100dvh] bg-[#F8F6F0] selection:bg-[#183D33]/15 selection:text-[#183D33]">
        {children}
      </body>
    </html>
  );
}
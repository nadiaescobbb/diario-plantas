import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plant Diary - Manage your plants',
  description: 'Professional application for plant care and tracking',
  keywords: 'plants, gardening, watering, plant care',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

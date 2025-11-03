import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from './components/I18nProvider';

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
    <html lang="en">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
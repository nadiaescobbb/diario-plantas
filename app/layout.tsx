import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'Diario de Plantas - Gestiona tus plantas',
  description: 'Aplicación profesional para el cuidado y seguimiento de tus plantas',
  keywords: 'plantas, jardinería, riego, cuidado de plantas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
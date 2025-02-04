import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Colore',
  description: 'Pick colors from uploaded images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

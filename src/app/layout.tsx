import type { Metadata } from 'next'
import { Alfa_Slab_One, Lora, Montserrat } from 'next/font/google'
import './globals.css'

const alfaSlab = Alfa_Slab_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alfa-slab',
  display: 'swap'
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap'
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'El Profeta - Cerveza Artesanal',
  description: 'Descubre nuestras cervezas artesanales de calidad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${alfaSlab.variable} ${lora.variable} ${montserrat.variable}`}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
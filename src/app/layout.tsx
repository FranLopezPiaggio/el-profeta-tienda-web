import type { Metadata } from 'next'
import { Playfair_Display, Montserrat, Special_Gothic_Expanded_One } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
})

const specialGothic = Special_Gothic_Expanded_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-gothic',
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
    <html lang="es" className={`${playfair.variable} ${montserrat.variable} ${specialGothic.variable}`}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
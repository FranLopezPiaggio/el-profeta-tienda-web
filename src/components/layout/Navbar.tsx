'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { Logo } from './Logo'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/mayorista', label: 'Mayorista' },
  { href: '/negocios', label: 'Negocios' },
  { href: '/eventos', label: 'Eventos' },
]

const SCROLL_THRESHOLD = 60
const NAVBAR_HEIGHT = 80
const SCROLL_PROGRESS_MAX = 200

const LOGO_SIZES = {
  desktop: { expanded: { width: 100, height: 62 }, scrolled: { width: 70, height: 44 } },
}

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const itemCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Smooth scroll detection with progress tracking
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setScrolled(scrollY > SCROLL_THRESHOLD)
          setScrollProgress(Math.min(scrollY / SCROLL_PROGRESS_MAX, 1))
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Logo size based on scroll state
  const logoDims = scrolled ? LOGO_SIZES.desktop.scrolled : LOGO_SIZES.desktop.expanded

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 
          bg-white/80
          transition-all duration-300 ease-out will-change-transform
          ${scrolled ? 'bg-[#F7F3E8]/95 backdrop-blur-md shadow-md border-b border-[#E8DDD0]' : ''}`}
        style={{ height: scrolled ? 64 : NAVBAR_HEIGHT }}
      >
        <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
          {/* Logo - pushed down slightly */}
          <div className="pt-2">
            <Logo 
              width={logoDims.width} 
              height={logoDims.height} 
              progress={scrollProgress} 
            />
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-semibold tracking-wide transition-colors duration-200 drop-shadow-md ${scrolled ? 'text-[#5C361D] hover:text-[#B4753F]' : 'text-white hover:text-[#E8AC56]'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className={`hidden sm:block p-2.5 rounded-lg transition-colors duration-200 ${
                scrolled 
                  ? 'bg-[#25D366] text-white hover:bg-[#128C7E]' 
                  : 'bg-[#25D366]/90 text-white hover:bg-[#25D366]'
              }`}
            >
              <MessageCircle size={20} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors duration-200 ${scrolled ? 'text-[#5C361D]' : 'text-white drop-shadow-md'}`}
              aria-label="Carrito"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                  scrolled ? 'bg-[#B4753F] text-[#F2EBD1]' : 'bg-[#E8AC56] text-[#5C361D]'
                }`}>
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className={`lg:hidden p-2 ${scrolled ? 'text-[#5C361D]' : 'text-white drop-shadow-md'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Cerrar' : 'Menú'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-[72px] left-0 right-0 bg-[#F7F3E8] border-b shadow-lg">
            <div className="px-6 py-5 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-[#5C361D] text-base font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#E8DDD0]">
                <Link
                  href="/contacto"
                  className="block bg-[#E8AC56] text-[#5C361D] px-4 py-3 rounded-lg text-center text-sm font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && <CartSidebar onClose={() => setIsCartOpen(false)} />}
    </>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { CartSidebar } from '@/components/cart/CartSidebar'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/mayorista', label: 'Mayorista' },
  { href: '/negocios', label: 'Negocios' },
  { href: '/eventos', label: 'Eventos' },
]

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const itemCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50">
        <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/elprofetalogo-removebg-preview.png"
              alt="El Profeta"
              width={120}
              height={40}
              className="h-auto w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-900 hover:text-gray-600 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Cart */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contacto"
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium transition-colors min-h-[44px] flex items-center"
            >
              Contactar
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-900 hover:text-gray-600 cursor-pointer"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-900 hover:text-gray-600 text-base font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <Link
                  href="/contacto"
                  className="block bg-gray-900 text-white px-4 py-3 rounded-md text-center font-medium"
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
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/app/lib/store'
import { ShoppingBag } from 'lucide-react'
import { CartSidebar } from '@/app/components/cart/CartSidebar'

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const itemCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
        <Link href="/" className="font-serif text-xl font-bold text-gray-900">
          El Profeta
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
            Inicio
          </Link>
          <Link href="/catalogo" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
            Catálogo
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
      </div>

      {isCartOpen && <CartSidebar onClose={() => setIsCartOpen(false)} />}
    </nav>
  )
}
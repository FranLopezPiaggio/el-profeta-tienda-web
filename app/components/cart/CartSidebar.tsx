'use client'

import { useCartStore } from '@/app/lib/store'
import { formatPrice } from '@/app/lib/utils'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'

interface CartSidebarProps {
  onClose: () => void
}

export function CartSidebar({ onClose }: CartSidebarProps) {
  const items = useCartStore(state => state.items)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const getTotal = useCartStore(state => state.getTotal)
  const getItemCount = useCartStore(state => state.getItemCount)

  const itemCount = getItemCount()
  const total = getTotal()

  const handleQuantityChange = (id: string, delta: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Slide-out panel */}
      <aside 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-playfair text-xl font-bold text-gray-900">
            Tu carrito
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </h2>
          
          <button
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors rounded hover:bg-gray-100"
            aria-label="Cerrar carrito"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag size={64} strokeWidth={1} className="text-gray-300 mb-4" />
              <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 text-sm">
                Agrega cervezas para comenzar tu pedido
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-gray-900 text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors min-h-[44px]"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-4">
                      <h4 className="font-medium text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Quantity controls - 44px tap targets */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                        className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 min-w-[44px]"
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        type="button"
                      >
                        <Minus size={16} strokeWidth={2} />
                      </button>
                      
                      <span className="w-12 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                        className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 min-w-[44px]"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        type="button"
                      >
                        <Plus size={16} strokeWidth={2} />
                      </button>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with total */}
        {items.length > 0 && (
          <footer className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(total)}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              Finalizar pedido por WhatsApp
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}
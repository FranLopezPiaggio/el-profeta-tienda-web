'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import {
  generateOrderMessage,
  createWhatsAppLink,
  saveLastOrder,
  getLastOrder,
  clearLastOrder,
  formatWhatsAppPhoneForDisplay,
  getWhatsAppPhone,
  saveOrderAndGenerateLink
} from '@/lib/checkout'
import { X, ShoppingBag, Minus, Plus, Trash2, Phone, RotateCcw } from 'lucide-react'

interface CartSidebarProps {
  onClose: () => void
}

interface FormData {
  name: string
  phone: string
  address: string
}

interface FormErrors {
  name: string
  phone: string
  address: string
}

interface Touched {
  name: boolean
  phone: boolean
  address: boolean
}

export function CartSidebar({ onClose }: CartSidebarProps) {
  const items = useCartStore(state => state.items)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const clearCart = useCartStore(state => state.clearCart)
  const getTotal = useCartStore(state => state.getTotal)
  const getItemCount = useCartStore(state => state.getItemCount)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: ''
  })
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    phone: '',
    address: ''
  })
  const [touched, setTouched] = useState<Touched>({
    name: false,
    phone: false,
    address: false
  })
  const [lastOrder, setLastOrder] = useState<ReturnType<typeof getLastOrder>>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCopyFallback, setShowCopyFallback] = useState(false)

  const itemCount = getItemCount()
  const total = getTotal()

  // Check for last order on mount
  useEffect(() => {
    const order = getLastOrder()
    setLastOrder(order)
  }, [])

  // Validate a single field
  const validateField = useCallback((field: keyof FormData, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Ingresá tu nombre'
        }
        if (value.trim().length < 2) {
          return 'El nombre debe tener al menos 2 caracteres'
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u.test(value)) {
          return 'El nombre solo puede contener letras y espacios'
        }
        return ''
      case 'phone':
        if (!value.trim()) {
          return 'Ingresá tu teléfono'
        }
        // Remove non-digits for validation
        const digitsOnly = value.replace(/\D/g, '')
        if (digitsOnly.length < 10) {
          return 'El teléfono debe tener al menos 10 dígitos'
        }
        return ''
      case 'address':
        if (!value.trim()) {
          return 'Ingresá la dirección de entrega'
        }
        if (value.trim().length < 5) {
          return 'La dirección debe tener al menos 5 caracteres'
        }
        return ''
      default:
        return ''
    }
  }, [])

  // Handle input change
  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // If field has been touched, validate on change to clear errors
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }, [touched, validateField])

  // Handle blur - mark as touched and validate
  const handleBlur = useCallback((field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [formData, validateField])

  // Check if form is valid
  const isFormValid = useCallback(() => {
    const nameError = validateField('name', formData.name)
    const phoneError = validateField('phone', formData.phone)
    const addressError = validateField('address', formData.address)
    
    return !nameError && !phoneError && !addressError &&
           formData.name.trim() && formData.phone.trim() && formData.address.trim()
  }, [formData, validateField])

  // Handle checkout submission
  const handleCheckout = useCallback(async () => {
    if (!isFormValid() || items.length === 0) return

    setIsSubmitting(true)
    
    try {
      // Save order to Supabase first, then generate WhatsApp link with order ID
      const result = await saveOrderAndGenerateLink(
        formData.name,
        formData.phone,
        formData.address,
        items,
        total
      )
      
      if (result.error) {
        console.warn('Order saved with warning:', result.error)
      }
      
      // Try to open WhatsApp
      const opened = window.open(result.whatsappLink, '_blank')
      
      // If popup was blocked or didn't open app, show fallback
      if (!opened || opened.closed) {
        setShowCopyFallback(true)
      }
      
      // Save last order for recovery (includes orderId if available)
      saveLastOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: [...items],
        total,
        timestamp: Date.now()
      })
      
      // Clear the cart after successful submission
      clearCart()
      
      // Reset form
      setFormData({ name: '', phone: '', address: '' })
      setTouched({ name: false, phone: false, address: false })
      setErrors({ name: '', phone: '', address: '' })
      
    } catch (error) {
      console.error('Error during checkout:', error)
      setShowCopyFallback(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [isFormValid, items, total, formData, clearCart])

  // Handle copy phone number fallback
  const handleCopyPhone = useCallback(() => {
    const phone = getWhatsAppPhone()
    navigator.clipboard.writeText(phone).then(() => {
      alert(`Número copiado: ${phone}`)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = phone
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert(`Número copiado: ${phone}`)
    })
  }, [])

  // Handle restore last order
  const handleRestoreLastOrder = useCallback(() => {
    if (!lastOrder) return
    
    setFormData({
      name: lastOrder.customerName,
      phone: lastOrder.customerPhone,
      address: lastOrder.customerAddress
    })
    
    // Also restore items to cart
    lastOrder.items.forEach(item => {
      useCartStore.getState().addItem(item)
    })
    
    setLastOrder(null)
    clearLastOrder()
  }, [lastOrder])

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
              
              {/* Show last order button if exists */}
              {lastOrder && !items.length && (
                <button
                  onClick={handleRestoreLastOrder}
                  className="mt-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <RotateCcw size={16} />
                  Restaurar pedido anterior
                </button>
              )}
              
              <button
                onClick={onClose}
                className="mt-6 bg-gray-900 text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors min-h-[44px]"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <>
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

              {/* Checkout Form */}
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-4">
                  Datos de entrega
                </h3>
                
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label 
                      htmlFor="checkout-name" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre completo
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Juan Pérez"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors min-h-[44px] ${
                        touched.name && errors.name
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-gray-200 focus:border-gray-900'
                      }`}
                      aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                    />
                    {touched.name && errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label 
                      htmlFor="checkout-phone" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Teléfono
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="11 1234 5678"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors min-h-[44px] ${
                        touched.phone && errors.phone
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-gray-200 focus:border-gray-900'
                      }`}
                      aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                    />
                    {touched.phone && errors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address field */}
                  <div>
                    <label 
                      htmlFor="checkout-address" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Dirección de entrega
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder="Calle Falsa 123, Buenos Aires"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors min-h-[44px] ${
                        touched.address && errors.address
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-gray-200 focus:border-gray-900'
                      }`}
                      aria-describedby={touched.address && errors.address ? 'address-error' : undefined}
                    />
                    {touched.address && errors.address && (
                      <p id="address-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Last order restore button */}
                {lastOrder && (
                  <button
                    onClick={handleRestoreLastOrder}
                    className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    type="button"
                  >
                    <RotateCcw size={14} />
                    Restaurar pedido anterior
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer with total and checkout button */}
        {items.length > 0 && (
          <footer className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(total)}
              </span>
            </div>

            {/* Fallback copy button */}
            {showCopyFallback && (
              <button
                onClick={handleCopyPhone}
                className="w-full mb-3 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors min-h-[44px]"
                type="button"
              >
                <Phone size={18} />
                Copiar número de WhatsApp
              </button>
            )}

            {/* Checkout button - sticky on mobile */}
            <button
              onClick={handleCheckout}
              disabled={!isFormValid() || isSubmitting}
              className={`w-full bg-gray-900 text-white py-3 rounded font-medium transition-colors min-h-[44px] ${
                isFormValid() && !isSubmitting
                  ? 'hover:bg-gray-800 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar compra por WhatsApp'}
            </button>

            {/* Safe area padding for mobile */}
            <div className="md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
          </footer>
        )}
      </aside>

      {/* Mobile sticky button wrapper - shown below sidebar on mobile when scrolled */}
      <style jsx>{`
        @media (max-width: 768px) {
          aside :global(.fixed) {
            /* Ensure sidebar handles keyboard properly */
          }
        }
      `}</style>
    </>
  )
}
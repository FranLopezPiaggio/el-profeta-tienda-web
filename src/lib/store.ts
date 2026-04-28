import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, Discount } from './types'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  originalPrice?: number // price before discount
  discount?: number // discount percentage applied
  discounts?: Discount[]
}

// Default discount rules (can be overridden by product)
const DEFAULT_DISCOUNTS: Discount[] = [
  { minQty: 6, discount: 10 },
  { minQty: 12, discount: 15 },
  { minQty: 24, discount: 20 }
]

/**
 * Calculate discounted price based on quantity
 */
function calculateDiscountedPrice(price: number, quantity: number, discounts?: Discount[]): { finalPrice: number; discount: number } {
  const applicableDiscounts = discounts || DEFAULT_DISCOUNTS
  
  // Find the best applicable discount
  let bestDiscount = 0
  for (const rule of applicableDiscounts) {
    if (quantity >= rule.minQty) {
      bestDiscount = rule.discount
    }
  }
  
  if (bestDiscount === 0) {
    return { finalPrice: price, discount: 0 }
  }
  
  const finalPrice = price * (1 - bestDiscount / 100)
  return { finalPrice: Math.round(finalPrice), discount: bestDiscount }
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'originalPrice' | 'discount'>, product?: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number // Total without discounts
  getTotalDiscount: () => number // Total discount amount
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, product) => {
        const items = get().items
        const existing = items.find(i => i.id === item.id)
        
        // Get discounts from product or use defaults
        const discounts = product?.discounts || DEFAULT_DISCOUNTS

        if (existing) {
          const newQuantity = existing.quantity + item.quantity
          const { finalPrice, discount } = calculateDiscountedPrice(item.price, newQuantity, discounts)
          
          set({
            items: items.map(i =>
              i.id === item.id
                ? { 
                    ...i, 
                    quantity: newQuantity, 
                    price: finalPrice,
                    originalPrice: item.price,
                    discount,
                    discounts
                  }
                : i
            )
          })
        } else {
          const { finalPrice, discount } = calculateDiscountedPrice(item.price, item.quantity, discounts)
          
          set({ 
            items: [...items, { 
              ...item, 
              price: finalPrice,
              originalPrice: item.price,
              discount,
              discounts
            }] 
          })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        const items = get().items
        const item = items.find(i => i.id === id)
        
        if (!item) return
        
        const discounts = item.discounts || DEFAULT_DISCOUNTS
        const originalPrice = item.originalPrice || item.price
        const { finalPrice, discount } = calculateDiscountedPrice(originalPrice, quantity, discounts)
        
        set({
          items: items.map(i =>
            i.id === id 
              ? { 
                  ...i, 
                  quantity, 
                  price: finalPrice,
                  originalPrice,
                  discount,
                  discounts
                } 
              : i
          )
        })
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
          0
        )
      },

      getTotalDiscount: () => {
        const subtotal = get().getSubtotal()
        const total = get().getTotal()
        return subtotal - total
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      }
    }),
    {
      name: 'el-profeta-cart', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)
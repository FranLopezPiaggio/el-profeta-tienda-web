/**
 * Type definitions for El Profeta store
 * Core interfaces for products, cart, and categories
 */

export interface Discount {
  minQty: number
  discount: number // percentage
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category: string
  abv?: number // alcohol by volume
  volume?: string // e.g., "473ml"
  format?: string // e.g., "lata"
  available: boolean
  discounts?: Discount[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  discounts?: Discount[]
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface DiscountRule {
  [key: string]: number // key = quantity, value = discount percentage
}
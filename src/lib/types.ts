/**
 * Type definitions for El Profeta store
 * Core interfaces for products, cart, and categories
 */

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category: string
  available: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Category {
  id: string
  name: string
  description?: string
}
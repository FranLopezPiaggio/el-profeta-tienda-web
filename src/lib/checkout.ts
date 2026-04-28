/**
 * Checkout utilities for El Profeta
 * Handles WhatsApp message generation and order persistence
 */

import { CartItem } from './store'
import { formatPrice } from './utils'
import { saveOrderToSupabase } from './supabase/client'

// WhatsApp phone number from PROJECT.md
const WHATSAPP_PHONE = '5492324511751'

export interface LastOrder {
  customerName: string
  customerPhone: string
  customerAddress: string
  items: CartItem[]
  total: number
  timestamp: number
}

/**
 * Generates the WhatsApp order message with full order details
 */
export function generateOrderMessage(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: CartItem[],
  total: number
): string {
  const itemsList = items
    .map(item => {
      const subtotal = item.price * item.quantity
      return `- ${item.name} x${item.quantity} = ${formatPrice(subtotal)}`
    })
    .join('\n')

  return `Hola, soy ${customerName} y quiero hacer el siguiente pedido:

${itemsList}

Total: ${formatPrice(total)}

Dirección de entrega: ${customerAddress}
Teléfono: ${customerPhone}`
}

/**
 * Creates a WhatsApp wa.me link with the pre-filled message
 */
export function createWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`
}

/**
 * Saves the last order to localStorage for recovery
 */
export function saveLastOrder(order: LastOrder): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('el-profeta-last-order', JSON.stringify(order))
  } catch (error) {
    console.error('Error saving last order:', error)
  }
}

/**
 * Retrieves the last order from localStorage
 */
export function getLastOrder(): LastOrder | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('el-profeta-last-order')
    if (!stored) return null
    
    const order = JSON.parse(stored) as LastOrder
    
    // Check if order is older than 24 hours
    const oneDayMs = 24 * 60 * 60 * 1000
    if (Date.now() - order.timestamp > oneDayMs) {
      clearLastOrder()
      return null
    }
    
    return order
  } catch (error) {
    console.error('Error reading last order:', error)
    return null
  }
}

/**
 * Clears the last order from localStorage
 */
export function clearLastOrder(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('el-profeta-last-order')
  } catch (error) {
    console.error('Error clearing last order:', error)
  }
}

/**
 * Gets the WhatsApp phone number for display
 */
export function getWhatsAppPhone(): string {
  return WHATSAPP_PHONE
}

/**
 * Formats the WhatsApp phone number for display (e.g., +54 9 11 1234 5678)
 */
export function formatWhatsAppPhoneForDisplay(): string {
  const phone = WHATSAPP_PHONE
  // Format: 5491112345678 -> +54 9 11 1234 5678
  if (phone.startsWith('549')) {
    const without54 = phone.slice(2)
    const without9 = without54.slice(1)
    const areaCode = without9.slice(0, 2)
    const number = without9.slice(2)
    return `+54 9 ${areaCode} ${number.slice(0, 4)} ${number.slice(4)}`
  }
  return phone
}

/**
 * Saves order to Supabase and generates WhatsApp link with order ID
 * Flow: Form → Save to Supabase → Get order ID → Open WhatsApp
 */
export async function saveOrderAndGenerateLink(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: CartItem[],
  total: number
): Promise<{ orderId: string | null; whatsappLink: string; error?: string }> {
  // Save order to Supabase first (per D-01: Save to DB before WhatsApp)
  const result = await saveOrderToSupabase(
    customerName,
    customerPhone,
    customerAddress,
    items,
    total
  )

  if (!result.success || !result.orderId) {
    console.error('Failed to save order to Supabase:', result.error)
    // Continue with WhatsApp anyway but without order ID
    const message = generateOrderMessage(customerName, customerPhone, customerAddress, items, total)
    return { 
      orderId: null, 
      whatsappLink: createWhatsAppLink(message),
      error: result.error 
    }
  }

  // Generate message with order ID (per D-03: Include order ID in WhatsApp)
  const message = generateOrderMessageWithOrderId(
    customerName,
    customerPhone,
    customerAddress,
    items,
    total,
    result.orderId
  )

  return {
    orderId: result.orderId,
    whatsappLink: createWhatsAppLink(message)
  }
}

/**
 * Generates the WhatsApp order message with order ID
 */
function generateOrderMessageWithOrderId(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: CartItem[],
  total: number,
  orderId: string
): string {
  const itemsList = items
    .map(item => {
      const subtotal = item.price * item.quantity
      return `- ${item.name} x${item.quantity} = ${formatPrice(subtotal)}`
    })
    .join('\n')

  return `Hola, soy ${customerName} y quiero hacer el siguiente pedido:

${itemsList}

Total: ${formatPrice(total)}

Número de pedido: ${orderId}

Dirección de entrega: ${customerAddress}
Teléfono: ${customerPhone}`
}
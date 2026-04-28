/**
 * Supabase client for BROWSER/CLIENT COMPONENTS ONLY
 * Use this for: CartSidebar, Navbar, checkout forms, etc.
 * 
 * For SERVER COMPONENTS, use './supabase-server.ts'
 */

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

/**
 * Create Supabase client for browser/components
 * SAFE to use in Client Components
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Save order to Supabase
 * Use this in client components (CartSidebar)
 */
export async function saveOrderToSupabase(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>,
  total: number,
  email?: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = createClient()
  
  try {
    const itemsJson = JSON.stringify(items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })))
    
    const { data, error } = await supabase.rpc('save_order', {
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_customer_address: customerAddress,
      p_email: email || null,
      p_items: itemsJson,
      p_total: total
    })
    
    if (error) {
      console.error('Error saving order:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, orderId: data }
  } catch (error) {
    console.error('Exception saving order:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('order_id', orderId)
    
    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Exception updating order status:', error)
    return { success: false, error: String(error) }
  }
}

// Type exports
export interface Order {
  id: string
  order_id: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  customer_address: string
  total: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}
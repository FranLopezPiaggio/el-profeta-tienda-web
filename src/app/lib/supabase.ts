/**
 * Supabase client configuration for El Profeta
 * Phase 5: Simple CMS - Orders, Customers & Reports
 */

import { createBrowserClient, createServerClient, createMiddlewareClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Environment variables must be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

/**
 * Create Supabase client for browser/components
 */
export function createClient() {
  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
  )
}

/**
 * Create Supabase client for server components
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from Server Component - can be ignored
          }
        },
      },
    }
  )
}

/**
 * Create Supabase client for middleware
 */
export function createMiddlewareSupabaseClient(cookieStore: { getAll: () => any[], setAll: (cookies: any[]) => void }) {
  return createMiddlewareClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

/**
 * Get current session - for server components
 */
export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

/**
 * Check if user is authenticated - for server components
 */
export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  return session
}

/**
 * Types for order data
 */
export interface Customer {
  id: string
  email: string | null
  name: string
  phone: string
  created_at: string
}

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

/**
 * Save order to Supabase
 * Uses the database function for atomic operation
 */
export async function saveOrder(
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
    // Convert items to JSONB format for the function
    const itemsJson = JSON.stringify(items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })))
    
    // Call the database function
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
 * Get orders for CMS admin
 * Returns all orders with their items
 */
export async function getOrders(options?: {
  status?: string
  startDate?: string
  endDate?: string
  limit?: number
}): Promise<{ orders: (Order & { items: OrderItem[] })[]; error?: string }> {
  const supabase = await createServerSupabaseClient()
  
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })
    
    if (options?.status) {
      query = query.eq('status', options.status)
    }
    
    if (options?.startDate) {
      query = query.gte('created_at', options.startDate)
    }
    
    if (options?.endDate) {
      query = query.lte('created_at', options.endDate)
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching orders:', error)
      return { orders: [], error: error.message }
    }
    
    // Group order items with their orders
    const ordersWithItems = (data || []).map(order => ({
      ...order,
      items: order.order_items || []
    }))
    
    return { orders: ordersWithItems }
  } catch (error) {
    console.error('Exception fetching orders:', error)
    return { orders: [], error: String(error) }
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

/**
 * Get sales metrics for reports
 */
export async function getSalesMetrics(options?: {
  startDate?: string
  endDate?: string
  status?: string
}): Promise<{
  totalRevenue: number
  ordersCount: number
  averageOrderValue: number
  error?: string
}> {
  const supabase = await createServerSupabaseClient()
  
  try {
    let query = supabase
      .from('orders')
      .select('total', { count: 'exact', head: false })
    
    if (options?.status) {
      query = query.eq('status', options.status)
    }
    
    if (options?.startDate) {
      query = query.gte('created_at', options.startDate)
    }
    
    if (options?.endDate) {
      query = query.lte('created_at', options.endDate)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching sales metrics:', error)
      return { totalRevenue: 0, ordersCount: 0, averageOrderValue: 0, error: error.message }
    }
    
    const orders = data || []
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const ordersCount = orders.length
    const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0
    
    return {
      totalRevenue,
      ordersCount,
      averageOrderValue
    }
  } catch (error) {
    console.error('Exception fetching sales metrics:', error)
    return { totalRevenue: 0, ordersCount: 0, averageOrderValue: 0, error: String(error) }
  }
}

/**
 * Get top selling products
 */
export async function getTopProducts(options?: {
  limit?: number
  startDate?: string
  endDate?: string
}): Promise<{
  products: Array<{
    product_name: string
    units_sold: number
    revenue: number
  }>
  error?: string
}> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // First get orders in date range
    let ordersQuery = supabase
      .from('orders')
      .select('id')
    
    if (options?.startDate) {
      ordersQuery = ordersQuery.gte('created_at', options.startDate)
    }
    
    if (options?.endDate) {
      ordersQuery = ordersQuery.lte('created_at', options.endDate)
    }
    
    const { data: orders, error: ordersError } = await ordersQuery
    
    if (ordersError) {
      return { products: [], error: ordersError.message }
    }
    
    if (!orders || orders.length === 0) {
      return { products: [] }
    }
    
    const orderIds = orders.map(o => o.id)
    
    // Then get items for those orders
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, quantity, subtotal')
      .in('order_id', orderIds)
    
    if (itemsError) {
      return { products: [], error: itemsError.message }
    }
    
    // Aggregate by product
    const productMap = new Map<string, { units_sold: number; revenue: number }>()
    
    items?.forEach(item => {
      const existing = productMap.get(item.product_name) || { units_sold: 0, revenue: 0 }
      productMap.set(item.product_name, {
        units_sold: existing.units_sold + item.quantity,
        revenue: existing.revenue + (item.subtotal || 0)
      })
    })
    
    const products = Array.from(productMap.entries())
      .map(([product_name, data]) => ({ product_name, ...data }))
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, options?.limit || 10)
    
    return { products }
  } catch (error) {
    console.error('Exception fetching top products:', error)
    return { products: [], error: String(error) }
  }
}

/**
 * Get repeat customer rate
 */
export async function getRepeatCustomerRate(options?: {
  startDate?: string
  endDate?: string
}): Promise<{
  totalCustomers: number
  repeatCustomers: number
  repeatRate: number
  error?: string
}> {
  const supabase = await createServerSupabaseClient()
  
  try {
    let query = supabase
      .from('orders')
      .select('customer_phone')
    
    if (options?.startDate) {
      query = query.gte('created_at', options.startDate)
    }
    
    if (options?.endDate) {
      query = query.lte('created_at', options.endDate)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching customer rate:', error)
      return { totalCustomers: 0, repeatCustomers: 0, repeatRate: 0, error: error.message }
    }
    
    // Count orders per customer
    const customerOrders = new Map<string, number>()
    data?.forEach(order => {
      const count = customerOrders.get(order.customer_phone) || 0
      customerOrders.set(order.customer_phone, count + 1)
    })
    
    const totalCustomers = customerOrders.size
    const repeatCustomers = Array.from(customerOrders.values()).filter(count => count > 1).length
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0
    
    return {
      totalCustomers,
      repeatCustomers,
      repeatRate: Math.round(repeatRate * 100) / 100
    }
  } catch (error) {
    console.error('Exception fetching customer rate:', error)
    return { totalCustomers: 0, repeatCustomers: 0, repeatRate: 0, error: String(error) }
  }
}
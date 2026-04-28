/**
 * Supabase client for SERVER COMPONENTS ONLY
 * Use this for: CMS pages, API routes, Server Components
 * 
 * For CLIENT components, use './client.ts'
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase not configured')
}

/**
 * Create Supabase client for server components
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{name: string, value: string, options?: any}>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Called from Server Component - can be ignored
        }
      },
    },
  })
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
    
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, quantity, subtotal')
      .in('order_id', orderIds)
    
    if (itemsError) {
      return { products: [], error: itemsError.message }
    }
    
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
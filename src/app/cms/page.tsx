import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Package
} from 'lucide-react'

// Helper to get date ranges
function getDateRange(type: 'today' | 'week' | 'month') {
  const now = new Date()
  const start = new Date(now)
  
  switch (type) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
      start.setDate(now.getDate() - 7)
      break
    case 'month':
      start.setMonth(now.getMonth() - 1)
      break
  }
  
  return {
    start: start.toISOString(),
    end: now.toISOString()
  }
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default async function CMSDashboard() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // Ignore
          }
        },
      },
    }
  )

  // Get metrics for different time ranges
  const todayRange = getDateRange('today')
  const weekRange = getDateRange('week')
  const monthRange = getDateRange('month')

  // Fetch data in parallel
  const [
    { data: todayOrders },
    { data: weekOrders },
    { data: monthOrders },
    { data: pendingOrders }
  ] = await Promise.all([
    supabase.from('orders')
      .select('total')
      .gte('created_at', todayRange.start)
      .lte('created_at', todayRange.end),
    supabase.from('orders')
      .select('total')
      .gte('created_at', weekRange.start)
      .lte('created_at', weekRange.end),
    supabase.from('orders')
      .select('total')
      .gte('created_at', monthRange.start)
      .lte('created_at', monthRange.end)
      .eq('status', 'delivered'),
    supabase.from('orders')
      .select('*, customers(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  // Calculate metrics
  const todayRevenue = todayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const todayOrdersCount = todayOrders?.length || 0
  
  const weekRevenue = weekOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const weekOrdersCount = weekOrders?.length || 0
  
  const monthRevenue = monthOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const monthOrdersCount = monthOrders?.length || 0
  
  const averageOrderValue = weekOrdersCount > 0 ? weekRevenue / weekOrdersCount : 0
  const pendingCount = pendingOrders?.length || 0

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-playfair text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Resumen de tu tienda
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Hoy</span>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(todayRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {todayOrdersCount} pedidos
          </p>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Esta semana</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(weekRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {weekOrdersCount} pedidos
          </p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Este mes</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {monthOrdersCount} entregados
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Pendientes</span>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-sm text-gray-500 mt-1">
            pedidos sin confirmar
          </p>
        </div>
      </div>

      {/* Average Order Value */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Valor promedio por pedido</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(averageOrderValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Esta semana</p>
            <p className="text-lg font-semibold text-gray-700">
              {weekOrdersCount} pedidos
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions and recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/cms/orders"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Ver todos los pedidos</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              href="/cms/reports"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Ver reportes</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Pending Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pedidos pendientes</h2>
            <Link
              href="/cms/orders?status=pending"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Ver todos
            </Link>
          </div>
          
          {pendingOrders && pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.order_id}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer_name} • {formatDate(order.created_at)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay pedidos pendientes
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
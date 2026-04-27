'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Loader2, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react'

type TimeFilter = 'today' | 'week' | 'month' | 'custom'

interface SalesMetrics {
  totalRevenue: number
  ordersCount: number
  averageOrderValue: number
}

interface TopProduct {
  product_name: string
  units_sold: number
  revenue: number
}

interface CustomerStats {
  totalCustomers: number
  repeatCustomers: number
  repeatRate: number
}

const COLORS = ['#111827', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB']

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount)
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    ordersCount: 0,
    averageOrderValue: 0
  })
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    totalCustomers: 0,
    repeatCustomers: 0,
    repeatRate: 0
  })

  const supabase = createClient()

  // Calculate date range based on filter
  const getDateRange = (): { start: string; end: string } | null => {
    const now = new Date()
    const end = now.toISOString()
    let start: string

    switch (timeFilter) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0)).toISOString()
        break
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7)).toISOString()
        break
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
        break
      case 'custom':
        if (!customStart || !customEnd) return null
        start = new Date(customStart).toISOString()
        return { start, end: new Date(customEnd).toISOString() }
      default:
        return null
    }

    return { start, end }
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dateRange = getDateRange()
      
      if (!dateRange) {
        setLoading(false)
        return
      }

      try {
        // Fetch sales metrics
        let ordersQuery = supabase
          .from('orders')
          .select('total')
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end)
          .eq('status', 'delivered')

        const { data: ordersData } = await ordersQuery
        
        const totalRevenue = (ordersData || []).reduce((sum, o) => sum + (o.total || 0), 0)
        const ordersCount = (ordersData || []).length
        const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0

        setSalesMetrics({ totalRevenue, ordersCount, averageOrderValue })

        // Fetch top products
        const orderIdsQuery = await supabase
          .from('orders')
          .select('id')
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end)
          .eq('status', 'delivered')

        const orderIds = (orderIdsQuery.data || []).map(o => o.id)
        
        if (orderIds.length > 0) {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('product_name, quantity, subtotal')
            .in('order_id', orderIds)

          // Aggregate by product
          const productMap = new Map<string, { units_sold: number; revenue: number }>()
          itemsData?.forEach(item => {
            const existing = productMap.get(item.product_name) || { units_sold: 0, revenue: 0 }
            productMap.set(item.product_name, {
              units_sold: existing.units_sold + item.quantity,
              revenue: existing.revenue + (item.subtotal || 0)
            })
          })

          const products = Array.from(productMap.entries())
            .map(([product_name, data]) => ({ product_name, ...data }))
            .sort((a, b) => b.units_sold - a.units_sold)
            .slice(0, 10)

          setTopProducts(products)
        } else {
          setTopProducts([])
        }

        // Fetch customer stats
        const { data: customerOrders } = await supabase
          .from('orders')
          .select('customer_phone')
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end)

        const customerOrderCounts = new Map<string, number>()
        customerOrders?.forEach(order => {
          const count = customerOrderCounts.get(order.customer_phone) || 0
          customerOrderCounts.set(order.customer_phone, count + 1)
        })

        const totalCustomers = customerOrderCounts.size
        const repeatCustomers = Array.from(customerOrderCounts.values()).filter(c => c > 1).length
        const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0

        setCustomerStats({ totalCustomers, repeatCustomers, repeatRate: Math.round(repeatRate * 100) / 100 })
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeFilter, customStart, customEnd])

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-playfair text-2xl font-bold text-gray-900">
          Reportes
        </h1>
        <p className="text-gray-600 mt-1">
          Métricas y estadísticas de ventas
        </p>
      </div>

      {/* Time filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-gray-700">Período:</span>
          
          <div className="flex gap-2">
            {(['today', 'week', 'month'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === filter
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'today' ? 'Hoy' : filter === 'week' ? 'Esta semana' : 'Este mes'}
              </button>
            ))}
            
            <button
              onClick={() => setTimeFilter('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === 'custom'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom
            </button>
          </div>

          {timeFilter === 'custom' && (
            <div className="flex gap-2 items-center ml-4">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="text-gray-500">hasta</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Sales Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Ingresos totales</span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(salesMetrics.totalRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Ventas del período
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Pedidos</span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {salesMetrics.ordersCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Pedidos entregados
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Valor promedio</span>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(salesMetrics.averageOrderValue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Por pedido
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Products Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Productos más vendidos</h2>
              
              {topProducts.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis 
                        dataKey="product_name" 
                        type="category" 
                        stroke="#6B7280"
                        width={90}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="units_sold" fill="#111827" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No hay datos disponibles
                </div>
              )}
            </div>

            {/* Revenue by Product */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Ingresos por producto</h2>
              
              {topProducts.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts.slice(0, 5)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="product_name" 
                        stroke="#6B7280"
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Bar dataKey="revenue" fill="#4B5563" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Estadísticas de clientes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerStats.totalCustomers}
                  </p>
                  <p className="text-sm text-gray-500">Clientes únicos</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerStats.repeatCustomers}
                  </p>
                  <p className="text-sm text-gray-500">Clientes recurrentes</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerStats.repeatRate}%
                  </p>
                  <p className="text-sm text-gray-500">Tasa de repetición</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/app/lib/supabase'
import { 
  Search, 
  Filter, 
  ChevronDown,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  Eye,
  Loader2
} from 'lucide-react'

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled' | 'all'
type TimeFilter = 'today' | 'week' | 'month' | 'all'

interface Order {
  id: string
  order_id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  total: number
  status: OrderStatus
  created_at: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
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

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: Truck },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
  all: { label: 'Todos', color: 'bg-gray-100 text-gray-800', icon: Filter }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const supabase = createClient()

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false })

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      // Apply time filter
      const now = new Date()
      if (timeFilter === 'today') {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString()
        query = query.gte('created_at', startOfDay)
      } else if (timeFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString()
        query = query.gte('created_at', weekAgo)
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
        query = query.gte('created_at', monthAgo)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      // Group items with orders
      const ordersWithItems = (data || []).map(order => ({
        ...order,
        items: order.order_items || []
      }))

      setOrders(ordersWithItems)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, statusFilter, timeFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Update order status
  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId)
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('order_id', orderId)

      if (error) {
        console.error('Error updating status:', error)
        alert('Error al actualizar el estado')
      } else {
        // Refresh orders
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Filter orders by search
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase()
    return (
      order.order_id.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower) ||
      order.customer_phone.includes(searchLower)
    )
  })

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-playfair text-2xl font-bold text-gray-900">
          Pedidos
        </h1>
        <p className="text-gray-600 mt-1">
          Lista de todos los pedidos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-900"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-900 bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Time filter */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-900 bg-white"
            >
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No se encontraron pedidos
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon
                  
                  return (
                    <>
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {order.order_id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customer_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customer_phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )}
                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded order details */}
                      {expandedOrder === order.id && (
                        <tr key={`${order.id}-details`}>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Items */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Productos
                                </h4>
                                <ul className="space-y-2">
                                  {order.items.map((item: OrderItem) => (
                                    <li key={item.id} className="flex justify-between text-sm">
                                      <span className="text-gray-600">
                                        {item.product_name} x{item.quantity}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {formatCurrency(item.subtotal)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Delivery info */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Entrega
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {order.customer_address}
                                </p>
                              </div>
                              
                              {/* Status actions */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Cambiar estado
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {(['pending', 'confirmed', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => updateStatus(order.order_id, status)}
                                      disabled={updatingStatus === order.id || order.status === status}
                                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                        order.status === status
                                          ? 'bg-gray-900 text-white border-gray-900'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                      } disabled:opacity-50`}
                                    >
                                      {statusConfig[status].label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}